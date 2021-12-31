const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Role, CartItem } = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const unlinkFile = require("../libs/unlinkFile")

exports.signIn = catchAsync(async (req, res, next) => {
  const { username, password, cartItems } = req.body;

  if (!username || !password) {
    next(new AppError("Username and password cannot empty", 400));
  }

  let user = await User.findOne({
    where: { username: username },
    include: Role,
  });

  if (user.disabled == true) {
    res.json({ status: "failed", message: "Account has been disabled" });
    return;
  }

  if (!(user && bcrypt.compareSync(password, user.password_hash))) {
    return next(new AppError("Username or password is incorrect", 401));
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

  user.session_token = token;
  user.save();

  if (cartItems) {
    for (let i = 0; i < cartItems.length; i++) {
      const { product_id, quantity } = cartItems[i];

      const oldItem = await CartItem.findOne({
        where: { product_id, user_id: user.id },
      });

      if (oldItem) {
        await CartItem.update(
          { quantity: oldItem.quantity + quantity },
          { where: { id: oldItem.id } }
        );
      } else {
        await CartItem.create({ product_id, quantity, user_id: user.id });
      }
    }
  }

  return res.json({
    status: "success",
    message: "Logged in successfully",
    accessToken: token,
    userInfo: {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role.role_code,
      avatar: user.avatar,
    },
  });
});

exports.signUp = catchAsync(async (req, res, next) => {
  const {
    username,
    first_name,
    last_name,
    address,
    avatar,
    password,
    email,
    phone,
  } = req.body;

  if (!(username && first_name && last_name && password && email)) {
    return next(
      new AppError(
        "Username, password, first name, last name and email cannot empty",
        400
      )
    );
  }

  const password_hash = bcrypt.hashSync(password, username.length);

  const customerRole = await Role.findOne({ where: { role_code: "cus" } });

  const newRecord = await User.create({
    role_id: customerRole.id,
    username,
    first_name,
    last_name,
    address,
    avatar,
    password_hash,
    email,
    phone,
  });

  res.json({
    status: "success",
    message: "Sign Up Success",
  });
});

exports.signOut = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.update(
    { session_token: null },
    { where: { id: userId } }
  );

  return res.json({
    status: "success",
    message: "Successful logout",
  });
});

exports.getInfo = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (!user) return next(new AppError("Not found user", 404));

  const { first_name, last_name, username, avatar } = user;
  return res.json({
    status: "success",
    data: { role: req.userRole, first_name, last_name, username, avatar },
  });
});

exports.getAllInfo = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.userId, {include: [Role]});
  if (!user) return next(new AppError("Not found user", 404));

  const { first_name, last_name, username, address, avatar, email, phone } = user;
  return res.json({
    status: "success",
    message: 'success',
    data: { first_name, last_name, username, address, avatar, email, phone, role_name: user.role.name },
  });
});

exports.changeInfo = catchAsync(async (req, res, next) => {
  const { first_name, last_name, address, avatar, phone } = req.body;
  const preAvatar = await User.findByPk(req.userId).then((b) => b.avatar);

  await User.update({ first_name, last_name, address, avatar, phone }, {where: {id: req.userId}});

  if (avatar != preAvatar) {
    unlinkFile(preAvatar);
  }

  res.json({
    status: "success",
    message: `Update info successfully`,
  });
})

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const { oldPassword, newPassword } = req.body;

  if (!bcrypt.compareSync(oldPassword, user.password_hash)) {
    return next(new AppError("Old password is incorrect", 401));
  }
  if (oldPassword === newPassword) {
    return next(new AppError("The new password must be different from the old password", 400));
  }
  const newpassword_hash = bcrypt.hashSync(newPassword, user.username.length);

  const [num] = await User.update(
    { password_hash: newpassword_hash },
    { where: { id: user.id } }
  );

  if (num > 0) {
    return res.json({
      status: "success",
      message: "Change password successfully",
    });
  } else {
    return next(new AppError("User not found", 404));
  }
});

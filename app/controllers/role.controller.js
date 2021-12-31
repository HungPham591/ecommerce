const { Role, User } = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");

exports.getAll = catchAsync(async (req, res, next) => {
  const roles = await Role.findAll({ include: User });

  res.json({
    status: "success",
    data: roles,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const role = await Role.findByPk(req.params.id, { include: User });

  if (role) {
    res.json({
      status: "success",
      data: role,
    });
  } else next(new AppError("Role doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const [num] = await Role.update(req.body, { where: { id: req.params.id } });

  res.json({
    status: "success",
    message: `${num} row(s) updated`,
    rows: num,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) {
    return next(new AppError("Role not found", 400));
  }

  const users = await role.getUsers();

  res.json({
    status: "success",
    data: users,
  });
});

exports.addUserRoles = catchAsync(async (req, res, next) => {
  const userIds = req.body.user_ids;
  if (!userIds) {
    return next(new AppError("No selected user", 400));
  }

  const targetRole = await Role.findByPk(req.params.id);
  if (!targetRole) {
    return next(new AppError("Role not found", 400));
  }

  const users = await User.findAll({
    where: { id: { [Op.in]: [...userIds] } },
  });

  await targetRole.addUsers(users);

  const newRolesInTargetRole = await Role.findByPk(req.params.id, { include: User});

  res.json({
    status: "success",
    data: newRolesInTargetRole,
  });
});

exports.deleteUserRoles = catchAsync(async (req, res, next) => {
  const userIds = req.body.user_ids;
  if (!userIds) {
    return next(new AppError("No selected user role to remove", 400));
  }

  const targetRole = await Role.findByPk(req.params.id);
  if (!targetRole) {
    return next(new AppError("Role not found", 400));
  }
  if (targetRole.role_code == 'cus') {
    return next(new AppError("You cannot delete the user's customer role, because this is the lowest role", 400));
  }

  const cusRole = await Role.findOne({ where: { role_code: "cus" } });

  const users = await User.findAll({
    where: { id: { [Op.in]: [...userIds] } },
  });

  await cusRole.addUsers(users);

  const newRolesInTargetRole = await Role.findByPk(req.params.id, { include: User});

  res.json({
    status: "success",
    data: newRolesInTargetRole,
  });
});

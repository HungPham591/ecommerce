const { User, Role } = require("../models/sequelize.model");
const bcrypt = require("bcryptjs");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");
const unlinkFile = require("../libs/unlinkFile");

exports.create = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }
  const password_hash = bcrypt.hashSync(
    req.body.password,
    req.body.username.length
  );

  const newRecord = await User.create({ ...req.body, password_hash });

  res.json({
    status: "success",
    message: "Create success",
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const records = await User.findAll({
    include: Role,
    attributes: { exclude: ["password_hash"] },
  });

  res.json({
    status: "success",
    data: records,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await User.findByPk(req.params.id, {
    attributes: { exclude: ["password_hash"] },
  });

  if (record) {
    res.json({
      status: "success",
      data: record,
    });
  } else next(new AppError("User doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const { first_name, last_name, role_id, address, avatar, phone, disabled } = req.body;

  const preAvatar = await User.findByPk(req.params.id).then((r) => r.avatar);

  const [num] = await User.update(
    { first_name, last_name, role_id, address, avatar, phone, disabled },
    { where: { id: req.params.id } }
  );

  if (req.body.avatar != preAvatar) {
    unlinkFile(preAvatar);
  }

  res.json({
    status: "success",
    message: `${num} row(s) updated`,
    rows: num,
  });
});

exports.removeById = catchAsync(async (req, res, next) => {
  const preAvatar = await User.findByPk(req.params.id).then((b) => b.avatar);

  const num = await User.destroy({ where: { id: req.params.id } });

  unlinkFile(preAvatar);

  if (num > 0) {
    res.json({
      status: "success",
      message: `${num} row(s) deleted`,
      rows: num,
    });
  } else next(new AppError("Record not found"));
});

exports.removeMultiRows = catchAsync(async (req, res, next) => {
  const ids = req.body.ids;

  if (!ids) {
    return next(new AppError("No selected items", 400));
  }

  const records = await User.findAll({ where: { id: { [Op.in]: ids } } });

  const num = await User.destroy({ where: { id: { [Op.in]: ids } } });

  records.forEach((r) => {
    unlinkFile(r.avatar);
  });

  res.json({
    status: "success",
    message: `${num} row(s) deleted`,
    rows: num,
  });
});

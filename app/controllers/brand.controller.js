const { Brand } = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");
const unlinkFile = require("../libs/unlinkFile");

exports.create = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const newRecord = await Brand.create(req.body);

  res.json({
    status: "success",
    data: newRecord,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const records = await Brand.findAll();

  res.json({
    status: "success",
    data: records,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await Brand.findByPk(req.params.id);

  if (record) {
    res.json({
      status: "success",
      data: record,
    });
  } else next(new AppError("Brand doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const preAvatar = await Brand.findByPk(req.params.id).then((b) => b.avatar);

  const [num] = await Brand.update(req.body, { where: { id: req.params.id } });

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
  const preAvatar = await Brand.findByPk(req.params.id).then((b) => b.avatar);

  const num = await Brand.destroy({ where: { id: req.params.id } });

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

  const records = await Brand.findAll({ where: { id: { [Op.in]: ids } } });

  const num = await Brand.destroy({ where: { id: { [Op.in]: ids } } });

  records.forEach((r) => {
    unlinkFile(r.avatar);
  });

  res.json({
    status: "success",
    message: `${num} row(s) deleted`,
    rows: num,
  });
});

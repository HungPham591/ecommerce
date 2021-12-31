const { Category, Product } = require("../models/sequelize.model");
const sequelize = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");
const unlinkFile = require("../libs/unlinkFile");

exports.create = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const newRecord = await Category.create(req.body);

  res.json({
    status: "success",
    data: newRecord,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const records = await Category.findAll({ include: Product });

  res.json({
    status: "success",
    data: records,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await Category.findByPk(req.params.id, { include: Product });

  if (record) {
    res.json({
      status: "success",
      data: record,
    });
  } else next(new AppError("Category doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const preAvatar = await Category.findByPk(req.params.id).then(
    (b) => b.avatar
  );

  const [num] = await Category.update(req.body, {
    where: { id: req.params.id },
  });

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
  const t = await sequelize.transaction();

  try {
    const preAvatar = await Category.findByPk(req.params.id).then(
      (b) => b.avatar
    );

    Product.destroy({ where: { category_id: req.params.id }, transaction: t });

    const num = await Category.destroy({
      where: { id: req.params.id },
      transaction: t,
    });

    unlinkFile(preAvatar);

    if (num > 0) {
      res.json({
        status: "success",
        message: `${num} row(s) deleted`,
        rows: num,
      });
    } else next(new AppError("Record not found"));

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
});

exports.removeMultiRows = catchAsync(async (req, res, next) => {
  const ids = req.body.ids;

  if (!ids) {
    return next(new AppError("No selected items", 400));
  }

  const t = await sequelize.transaction();
  try {
    const records = await Category.findAll({ where: { id: { [Op.in]: ids } } });

    Product.destroy({
      where: { category_id: { [Op.in]: ids } },
      transaction: t,
    });

    const num = await Category.destroy({
      where: { id: { [Op.in]: ids } },
      transaction: t,
    });

    records.forEach((r) => {
      unlinkFile(r.avatar);
    });

    res.json({
      status: "success",
      message: `${num} row(s) deleted`,
      rows: num,
    });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
});

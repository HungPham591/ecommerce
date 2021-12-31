const { City, Order } = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");
const unlinkFile = require("../libs/unlinkFile");

exports.create = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const newRecord = await City.create(req.body);

  res.json({
    status: "success",
    data: newRecord,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const records = await City.findAll();

  res.json({
    status: "success",
    data: records,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await City.findByPk(req.params.id);

  if (record) {
    res.json({
      status: "success",
      data: record,
    });
  } else next(new AppError("City doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const [num] = await City.update(req.body, { where: { id: req.params.id } });

  res.json({
    status: "success",
    message: `${num} row(s) updated`,
    rows: num,
  });
});

exports.removeById = catchAsync(async (req, res, next) => {
  const orders = await Order.findAll({where: {city_id: req.params.id}});
  if (orders.length > 0) {
    return next(new AppError('An order associated with this city exists, cannot be deleted'), 400)
  }
  const num = await City.destroy({ where: { id: req.params.id } });


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
  const orders = await Order.findAll({ where: {city_id:{ [Op.in]: ids }}});
  if (orders.length > 0) {
    return next(new AppError('An order associated with cities exists, cannot be deleted'), 400)
  }

  if (!ids) {
    return next(new AppError("No selected items", 400));
  }

  const num = await City.destroy({ where: { id: { [Op.in]: ids } } });

  res.json({
    status: "success",
    message: `${num} row(s) deleted`,
    rows: num,
  });
});

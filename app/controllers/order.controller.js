const {
  Order,
  Product,
  User,
  OrderItem,
  City,
} = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");

exports.getAll = catchAsync(async (req, res, next) => {
  const records = await Order.findAll({
    include: [{ model: OrderItem, include: Product }, User, City],
  });

  res.json({
    status: "success",
    message: "success",
    data: records,
  });
});

exports.changStatus = catchAsync(async (req, res, next) => {
  const newStatus = req.body.status;
  const old = await Order.findOne({ where: { id: req.params.id } });
  const record = await Order.update(
    { status: newStatus },
    { where: { id: req.params.id } }
  );
  // if (
  //   ["success", "confirmed", "shipping"].includes(old.status) &&
  //   ["rejected", "falied", "cancelled"].includes(newStatus)
  // ) {
  //   const orderItems = await OrderItem.findAll({
  //     where: { order_id: req.params.id },
  //   });
  //   orderItems.forEach((orderitem) => {
  //     Product.update()
  //   });
  // }

  res.json({
    status: "success",
    message: "success",
    data: record,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await Order.findByPk(req.params.id, {
    include: [{ model: OrderItem, include: Product }, User, City],
  });

  if (record) {
    res.json({
      status: "success",
      message: "success",
      data: record,
    });
  } else next(new AppError("Order doesn't exit", 404));
});

exports.hideById = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;
  await Order.update({ delete_for_user: 1 }, { where: { id: orderId } });
  res.json({
    status: "success",
    message: `hide successfully`,
  });
});

exports.removeById = catchAsync(async (req, res, next) => {
  const num = await Order.destroy({
    where: { id: req.params.id },
  });

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

  const num = await Order.destroy({
    where: { id: { [Op.in]: ids } },
  });

  res.json({
    status: "success",
    message: `${num} row(s) deleted`,
    rows: num,
  });
});

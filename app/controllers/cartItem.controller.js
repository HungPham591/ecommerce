const {
  CartItem,
  Product,
  ProductImage,
  Order,
  OrderItem,
  City
} = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");

exports.create = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const { product_id, quantity } = req.body;
  const oldCartItem = await CartItem.findOne({
    where: { product_id: product_id, user_id: req.userId },
  });

  if (oldCartItem) {
    const newQuantity = quantity + oldCartItem.quantity;
    const num = await CartItem.update(
      {
        product_id,
        quantity: newQuantity,
      },
      { where: { id: oldCartItem.id } }
    );

    res.json({
      status: "success",
      message: `${num} row(s) updated`,
      rows: num,
    });
  } else {
    const newRecord = await CartItem.create({
      ...req.body,
      user_id: req.userId,
    });

    res.json({
      status: "success",
      message: "success",
      data: newRecord,
    });
  }
});

exports.getMyOrder = catchAsync(async (req, res, next) => {
  const records = await Order.findAll({
    where: { user_id: req.userId, delete_for_user: 0},
    include: [{ model: OrderItem, include: [Product] }, City],
  });

  res.json({
    status: "success",
    message: "success",
    data: records,
  });
})

exports.getAll = catchAsync(async (req, res, next) => {
  const records = await CartItem.findAll({
    where: { user_id: req.userId },
    include: [{ model: Product, include: [ProductImage] }],
  });

  res.json({
    status: "success",
    message: "success",
    data: records,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await CartItem.findByPk(req.params.id, { include: [Product] });

  if (record) {
    res.json({
      status: "success",
      data: record,
    });
  } else next(new AppError("CartItem doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const cartItem = await CartItem.findByPk(req.params.id);
  if (!cartItem) {
    return next(new AppError("Cart item not found.", 404));
  }

  if (cartItem.user_id != req.userId) {
    return next(new AppError("Forbidden!", 403));
  }

  const [num] = await CartItem.update(
    { ...req.body, user_id: req.userId },
    {
      where: { id: req.params.id, user_id: req.userId },
    }
  );

  res.json({
    status: "success",
    message: `success`,
    rows: num,
  });
});

exports.removeById = catchAsync(async (req, res, next) => {
  const num = await CartItem.destroy({
    where: { id: req.params.id, user_id: req.userId },
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

  const num = await Brand.destroy({
    where: { id: { [Op.in]: ids, user_id: req.userId } },
  });

  res.json({
    status: "success",
    message: `${num} row(s) deleted`,
    rows: num,
  });
});

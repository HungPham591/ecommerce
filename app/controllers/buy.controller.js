const {
  Buy,
  User,
  Supplier,
  BuyItem,
  Product,
} = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");
const sequelize = require("../models/sequelize.model");

exports.create = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const newRecord = await Buy.create({ ...req.body, user_id: req.userId });

  res.json({
    status: "success",
    data: newRecord,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const records = await Buy.findAll({
    include: [User, Supplier, { model: BuyItem, include: [Product] }],
  });

  res.json({
    status: "success",
    data: records,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await Buy.findByPk(req.params.id, {
    include: [User, Supplier, BuyItem],
  });

  if (record) {
    res.json({
      status: "success",
      data: record,
    });
  } else next(new AppError("Buy doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const buy = await Buy.findByPk(req.params.id);
  if (buy.user_id !== req.userId) {
    return next(new AppError("Can't manipulate other people's records", 403));
  }

  const { supplier_id, description } = req.body;

  const [num] = await Buy.update(
    { supplier_id, description },
    { where: { id: req.params.id } }
  );

  res.json({
    status: "success",
    message: `${num} row(s) updated`,
    rows: num,
  });
});

exports.addMoreBuyItem = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const buy = await Buy.findByPk(req.params.id);
  if (buy.user_id !== req.userId) {
    return next(new AppError("Can't manipulate other people's records", 403));
  }

  const { quantity, product_id } = req.body;

  const t = await sequelize.transaction();
  try {
    const product = await Product.findByPk(product_id);
    if (product.quantity >= 0) {
      await Product.update({quantity: product.quantity + quantity}, {where: {id: product_id}, transaction: t});
      const buyItem = await BuyItem.create({ ...req.body, buy_id: req.params.id }, {transaction: t});
      res.json({
        status: "success",
        data: buyItem,
      });
    }
    else {
      const buyItem = await BuyItem.create({ ...req.body, buy_id: req.params.id }, {transaction: t});
      res.json({
        status: "success",
        data: buyItem,
      });
    }
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw error;
  }
});

exports.removeBuyItem = catchAsync(async (req, res, next) => {
  const buyItem = await BuyItem.findByPk(req.params.buyItemId, {
    include: [Buy],
  });

  if (buyItem.buy.user_id !== req.userId) {
    return next(new AppError("Can't manipulate other people's records", 403));
  }

  const num = await BuyItem.destroy({ where: { id: req.params.buyItemId } });

  res.json({
    status: "success",
    message: `${num} row(s) deleted`,
    rows: num,
  });
});

exports.removeById = catchAsync(async (req, res, next) => {
  const buy = await Buy.findByPk(req.params.id, { include: [BuyItem] });
  if (buy.user_id !== req.userId) {
    return next(new AppError("Can't manipulate other people's records", 403));
  }

  const buyItemIds = buy.buy_items.map((bi) => bi.id);

  const t = await sequelize.transaction();
  try {
    await BuyItem.destroy({
      where: { id: { [Op.in]: buyItemIds } },
      transaction: t,
    });

    const num = await Buy.destroy({
      where: { id: req.params.id },
      transaction: t,
    });

    res.json({
      status: "success",
      message: `${num} row(s) deleted`,
      rows: num,
    });

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw error;
  }
});

exports.removeMultiRows = catchAsync(async (req, res, next) => {
  const ids = req.body.ids;

  if (!ids) {
    return next(new AppError("No selected items", 400));
  }

  const records = await Buy.findAll({ where: { id: { [Op.in]: ids } } });

  if (records.some((r) => r.user_id !== req.userId)) {
    return next(new AppError("Can't manipulate other people's records", 403));
  }

  const num = await Buy.destroy({ where: { id: { [Op.in]: ids } } });

  res.json({
    status: "success",
    message: `${num} row(s) deleted`,
    rows: num,
  });
});

const { Review, Product, User } = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const { Op } = require("sequelize");

exports.create = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const { product_id } = req.body;
  const oldReview = await Review.findOne({
    where: { product_id, user_id: req.userId },
  });
  if (oldReview) {
    return next(new AppError("You have reviewed this product before", 400));
  }

  const newRecord = await Review.create({
    ...req.body,
    user_id: req.userId,
  });

  res.json({
    status: "success",
    data: newRecord,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const records = await Review.findAll({
    where: { product_id: req.query.product_id },
    include: [Product, {model: User, where: {disabled: 0}}],
  });

  res.json({
    status: "success",
    data: records,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await Review.findByPk(req.params.id, { include: [Product, User] });

  if (record) {
    res.json({
      status: "success",
      data: record,
    });
  } else next(new AppError("Review doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const review = await Review.findByPk(req.params.id);
  if (!review) {
    return next(new AppError("Cart item not found.", 404));
  }

  if (review.user_id != req.userId) {
    return next(new AppError("Forbidden!", 403));
  }

  const [num] = await Review.update(
    { ...req.body, user_id: req.userId, product_id: review.product_id},
    {
      where: { id: req.params.id, user_id: req.userId },
    }
  );

  res.json({
    status: "success",
    message: `${num} row(s) updated`,
    rows: num,
  });
});

exports.removeById = catchAsync(async (req, res, next) => {
  const num = await Review.destroy({
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

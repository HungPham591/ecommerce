const {
  User,
  Category,
  Product,
  OrderItem,
  BuyItem,
  Order,
  Brand,
  Buy,
  City,
  Review,
  Supplier,
} = require("../models/sequelize.model");
const { Op } = require("sequelize");
const { AppError, catchAsync } = require("../libs");

const getFilter = (start, end) => {
  const filter = {};
  if (end && start)
    filter.created_at = { [Op.and]: [{ [Op.gte]: start }, { [Op.lte]: end }] };
  else if (end) filter.created_at = { [Op.lte]: end };
  else if (start) filter.created_at = { [Op.gte]: start };
  return filter;
};

exports.getByCategory = catchAsync(async (req, res, next) => {
  let { start, end } = req.query;
  if (start) start = new Date(parseInt(start));
  if (end) end = new Date(parseInt(end));
  const records = await Category.findAll({
    include: [
      {
        model: Product,
        include: [
          {
            model: OrderItem,
            include: { model: Order, where: {...getFilter(start, end), status: 'success'}  },
          },
          {
            model: BuyItem,
            include: { model: Buy, where: getFilter(start, end) },
          },
        ],
      },
    ],
  });

  res.json({
    status: "success",
    data: records,
  });
});

exports.getTopProduct = catchAsync(async (req, res, next) => {
  let { start, end } = req.query;
  if (start) start = new Date(parseInt(start));
  if (end) end = new Date(parseInt(end));

  const records = await Product.findAll({
    include: [
      {
        model: OrderItem,
        include: { model: Order, where: {...getFilter(start, end), status: 'success'}  },
      },
      {
        model: BuyItem,
        include: { model: Buy, where: getFilter(start, end) },
      },
    ],
  });
  const products = [...records];
  products.forEach(product => {
    product.sumInvestment = 0;
    product.sumRevenue = 0;
    product.buy_items.forEach(buyItem => {
      const {quantity, price} = buyItem;
      product.sumInvestment += quantity * price;
    })
    product.orderItems.forEach(orderItem => {
      const {quantity, unit_price} = orderItem;
      product.sumRevenue += quantity * unit_price;
    })
  })
  products.sort((a, b) => b.sumRevenue - a.sumRevenue);

  res.json({
    status: "success",
    data: products.slice(0, 6),
  });
});

exports.getLowProduct = catchAsync(async (req, res, next) => {
  let { start, end } = req.query;
  if (start) start = new Date(parseInt(start));
  if (end) end = new Date(parseInt(end));

  const records = await Product.findAll({
    include: [
      {
        model: OrderItem,
        include: { model: Order, where: {...getFilter(start, end), status: 'success'} },
      },
      {
        model: BuyItem,
        include: { model: Buy, where: getFilter(start, end) },
      },
    ],
  });
  console.log(records.length)
  const products = [...records];
  products.forEach(product => {
    product.sumInvestment = 0;
    product.sumRevenue = 0;
    product.buy_items.forEach(buyItem => {
      const {quantity, price} = buyItem;
      product.sumInvestment += quantity * price;
    })
    product.orderItems.forEach(orderItem => {
      const {quantity, unit_price} = orderItem;
      product.sumRevenue += quantity * unit_price;
    })
  })
  products.sort((a, b) => a.sumRevenue - b.sumRevenue);

  console.log(products.map(p => p.sumRevenue))

  res.json({
    status: "success",
    data: products.slice(0, 6),
  });
});

exports.getByTime = catchAsync(async (req, res, next) => {
  let { start, end } = req.query;
  if (start) start = new Date(parseInt(start));
  if (end) end = new Date(parseInt(end));

  const buys = await Buy.findAll({ include: [BuyItem], where: getFilter(start, end) });
  const orders = await Order.findAll({ include: [OrderItem] , where: {...getFilter(start, end), status: 'success'} });

  res.json({
    status: "success",
    data: [{buys, orders}],
  });
});

exports.getInventory = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({include: [Category, Brand], where: {quantity: {[Op.ne]: -1}}});

  res.json({
    status: "success",
    data: products.sort((a, b) => a.name.localeCompare(b.name)),
  });
});


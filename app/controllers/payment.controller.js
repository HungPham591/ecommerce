const {
  Order,
  Product,
  CartItem,
  City,
  OrderItem,
} = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const sequelize = require("../models/sequelize.model");
const { Op } = require("sequelize");
const paypal = require("../models/paypal.model");

exports.createNew = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const { delivery_intended, full_name, address, phone, city_id } = req.body;

  const cartItems = await CartItem.findAll({
    where: { user_id: userId },
    include: [Product],
  });

  const city = await City.findOne({ where: { id: city_id } });

  if (!cartItems || cartItems.length == 0) {
    return next(new AppError("No cart item found", 404));
  }
  let newOrderId;

  const sub_total = cartItems
    .reduce((a, b) => a + b.quantity * b.product.price, 0)
    .toFixed(2);
  const tax = (sub_total * 0.05).toFixed(2);
  const shipping = city.shipping;
  const total = parseFloat(sub_total) + parseFloat(tax) + parseFloat(shipping);

  const t = await sequelize.transaction();
  try {
    const newOrder = await Order.create(
      {
        user_id: userId,
        sub_total: sub_total,
        tax: tax,
        total: total,
        delivery_intended: delivery_intended,
        status: "confirmed",
        full_name: full_name,
        address: address,
        phone: phone,
        city_id: city_id,
      },
      { transaction: t }
    );

    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].product.quantity >= 0 && cartItems[i].product.quantity < cartItems[i].quantity) {
        throw new Error(`Insufficient inventory (${cartItems[i].product.name} only ${cartItems[i].product.quantity} left)`)
       }
 
       if (cartItems[i].product.quantity >= 0) {
         await Product.update(
           { quantity: (cartItems[i].product.quantity - cartItems[i].quantity) },
           { where: { id: cartItems[i].product.id }, transaction: t }
         );
       }

      await OrderItem.create(
        {
          order_id: newOrder.id,
          product_id: cartItems[i].product_id,
          unit_price: cartItems[i].product.price,
          quantity: cartItems[i].quantity,
        },
        {
          transaction: t,
        }
      );
    }

    for (let i = 0; i < cartItems.length; i++) {
      await CartItem.destroy({
        where: { id: cartItems[i].id },
        transaction: t,
      });
    }

    newOrderId = newOrder.id;

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:5000/payment/success",
      cancel_url: "http://localhost:5000/payment/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [],
        },
        amount: {
          currency: "USD",
          total: total,
        },
        description: "Payment from Pixel light",
      },
    ],
  };

  cartItems.forEach((item) => {
    create_payment_json.transactions[0].item_list.items.push({
      name: `${item.product.name}`,
      sku: item.id,
      price: item.product.price,
      currency: "USD",
      quantity: item.quantity,
    });
  });
  create_payment_json.transactions[0].item_list.items.push({
    name: `tax`,
    sku: "tax",
    price: tax,
    currency: "USD",
    quantity: 1,
  });
  create_payment_json.transactions[0].item_list.items.push({
    name: `shipping fee`,
    sku: "shipping",
    price: shipping,
    currency: "USD",
    quantity: 1,
  });
  console.log(JSON.stringify(create_payment_json));

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error);
      next(error);
    } else {
      try {
        const paymentId = payment.id;
        Order.update({ payment_id: paymentId }, { where: { id: newOrderId } });

        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.json({
              status: "success",
              message: "success",
              data: payment.links[i].href,
              orderId: newOrderId,
            });
            return;
          }
        }
        return next(new AppError("Fail to create payment", 500));
      } catch (err) {
        next(err);
      }
    }
  });
});

exports.createNewOffline = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const { delivery_intended, full_name, address, phone, city_id } = req.body;

  const cartItems = await CartItem.findAll({
    where: { user_id: userId },
    include: [Product],
  });

  const city = await City.findOne({ where: { id: city_id } });

  if (!cartItems || cartItems.length == 0) {
    return next(new AppError("No cart item found", 404));
  }

  const sub_total = cartItems
    .reduce((a, b) => a + b.quantity * b.product.price, 0)
    .toFixed(2);
  const tax = (sub_total * 0.05).toFixed(2);
  const shipping = city.shipping;
  const total = parseFloat(sub_total) + parseFloat(tax) + parseFloat(shipping);

  const t = await sequelize.transaction();
  try {
    const newOrder = await Order.create(
      {
        user_id: userId,
        sub_total: sub_total,
        tax: tax,
        total: total,
        delivery_intended: delivery_intended,
        status: "confirmed",
        full_name: full_name,
        address: address,
        phone: phone,
        city_id: city_id,
      },
      { transaction: t }
    );

    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].product.quantity >= 0 && cartItems[i].product.quantity < cartItems[i].quantity) {
       throw new Error(`Insufficient inventory (${cartItems[i].product.name} only ${cartItems[i].product.quantity} left)`)
      }

      if (cartItems[i].product.quantity >= 0) {
        await Product.update(
          { quantity: (cartItems[i].product.quantity - cartItems[i].quantity) },
          { where: { id: cartItems[i].product.id }, transaction: t }
        );
      }

      await OrderItem.create(
        {
          order_id: newOrder.id,
          product_id: cartItems[i].product_id,
          unit_price: cartItems[i].product.price,
          quantity: cartItems[i].quantity,
        },
        {
          transaction: t,
        }
      );
    }

    for (let i = 0; i < cartItems.length; i++) {
      await CartItem.destroy({
        where: { id: cartItems[i].id },
        transaction: t,
      });
    }

    res.json({ status: "success", message: "success", orderId: newOrder.id });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
});

exports.success = catchAsync(async (req, res, next) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const order = await Order.findOne({
    where: { payment_id: paymentId },
  });
  if (!order) {
    return next(
      "Sorry, failed payment, something wrong in server, try late",
      500
    );
  }

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: order.total,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        await Order.update({ paid: 1 }, { where: { payment_id: paymentId } });
        res.send(
          `<button onclick="window.close();">Payment successfully, click to close this window</button>`
        );
      }
    }
  );
});
exports.cancel = catchAsync(async (req, res, next) => {
  res.json({ status: "fail", message: "Payment is canceled" });
});

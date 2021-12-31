const {
  Product,
  ProductImage,
  Brand,
  Category,
  Review,
  OrderItem,
  Order,
} = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");
const sequelize = require("../models/sequelize.model");
const { Op } = require("sequelize");
const unlinkFile = require("../libs/unlinkFile");

const isPublicProduct = (nowDate, isInCart = false) => {
  if (isInCart)
    return {
      public_for_sale: 1,
    };
  return {
    public_for_sale: 1,
    quantity: { [Op.ne]: 0 },
    ends_at: {
      [Op.or]: {
        [Op.gte]: nowDate,
        [Op.eq]: null,
      },
    },
    starts_at: {
      [Op.or]: {
        [Op.lte]: nowDate,
        [Op.eq]: null,
      },
    },
  };
};

exports.create = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const newRecord = await Product.create(req.body);

  const images = req.body.images;
  if (images?.length) {
    images.forEach((img) => {
      const { src, priority, description } = img;
      ProductImage.create({
        product_id: newRecord.id,
        src,
        priority,
        description,
      });
    });
  }

  res.json({
    status: "success",
    data: newRecord,
  });
});

exports.changeAvatar = catchAsync(async (req, res, next) => {
  await ProductImage.update(
    { priority: 1 },
    { where: { product_id: req.params.id } }
  );
  const idAvatar = req.body.avatarId;
  await ProductImage.update({ priority: 2 }, { where: { id: idAvatar } });

  res.json({
    status: "success",
    message: "success",
  });
});

exports.changeQuantity = catchAsync(async (req, res, next) => {
  const plus = parseInt(req.body.plus);
  const product = await Product.findOne({ where: { id: req.params.id } });

  if (product.quantity == -1) {
    return next(
      new AppError("The product does not have a quantity statistic."),
      400
    );
  }
  if (plus < 0 && product.quantity < Math.abs(plus)) {
    return next(
      new AppError("Not enough inventory allowed to be deducted"),
      500
    );
  }
  const newQuantity = product.quantity + plus;

  await Product.update(
    { quantity: newQuantity },
    { where: { id: req.params.id } }
  );

  res.json({
    status: "success",
    message: `${plus >= 0 ? "Added" : "Deducted"} ${Math.abs(plus)} items for ${
      product.name
    } (id: ${product.id})`,
  });
});

exports.searchAll = catchAsync(async (req, res, next) => {
  records = await Product.findAll({
    attributes: ["id", "name"],
  });

  records.sort((a, b) => a.name.localeCompare(b.name));

  res.json({
    status: "success",
    message: "success",
    data: records,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const isInCart = req.query.incart;
  const categoryTitle = req.query.category;
  const forShopping = req.query.forshop;
  const category =
    categoryTitle &&
    (await Category.findOne({ where: { title: categoryTitle } }));
  const categoryId = category && category.id;

  const brandTitle = req.query.brand;
  const brand =
    brandTitle && (await Brand.findOne({ where: { name: brandTitle } }));
  const brandId = brand && brand.id;

  let records;
  if ((req.userRole === "ad" || req.userRole === "sa") && !forShopping) {
    records = await Product.findAll({
      where: {
        ...(categoryId ? { category_id: categoryId } : {}),
        ...(brandId ? { brand_id: brandId } : {}),
      },
      include: [ProductImage, Brand, Category, Review],
    });
  } else {
    const nowDate = new Date();
    records = await Product.findAll({
      where: {
        ...(categoryId ? { category_id: categoryId } : {}),
        ...(brandId ? { brand_id: brandId } : {}),
        ...isPublicProduct(nowDate, isInCart),
      },
      include: [ProductImage, Brand, Category, Review],
    });
  }

  res.json({
    status: "success",
    data: records,
  });
});

exports.findById = catchAsync(async (req, res, next) => {
  const record = await Product.findByPk(req.params.id, {
    include: [ProductImage, Brand, Category],
    where: { public_for_sale: 1 },
  });

  if (record) {
    res.json({
      status: "success",
      data: record,
    });
  } else next(new AppError("Product doesn't exit", 404));
});

exports.update = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body can't be empty."));
  }

  const [num] = await Product.update(req.body, {
    where: { id: req.params.id },
  });

  const images = req.body.images;
  if (images?.length) {
    images.forEach((img) => {
      const { src, priority, description } = img;
      ProductImage.create({
        product_id: req.params.id,
        src,
        priority,
        description,
      });
    });
  }

  res.json({
    status: "success",
    message: `${num} row(s) updated`,
    rows: num,
  });
});

exports.relatedProducts = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const target = await Product.findOne({ where: { id: productId } });

  const nowDate = new Date();
  const products = await Product.findAll({
    include: [Brand, Category, ProductImage, Review],
    where: {
      ...isPublicProduct(nowDate),
      id: { [Op.ne]: productId },
    },
  });

  products.forEach((product) => {
    product.relatePoint = 0;
    if (target.brand_id === product.brand_id) product.relatePoint += 1;
    if (target.category_id === product.category_id) product.relatePoint += 1.5;
    const subPrice = Math.abs(target.price - product.price);
    product.relatePoint += 1 - subPrice / product.price;
  });
  const result = products
    .sort((a, b) => b.relatePoint - a.relatePoint)
    .slice(0, 5)
    .map(
      ({
        relatePoint,
        brand,
        price,
        category,
        name,
        id,
        brand_id,
        category_id,
        productImages,
        reviews,
      }) => ({
        relatePoint,
        brand,
        price,
        category,
        name,
        id,
        brand_id,
        category_id,
        productImages,
        reviews,
      })
    );

  res.json({ status: "success", message: `success`, data: result });
});

exports.bestSeller = catchAsync(async (req, res, next) => {
  const nowDate = new Date();
  const products = await Product.findAll({
    include: [OrderItem, Brand, Category, ProductImage, Review],
    where: {
      ...isPublicProduct(nowDate),
    },
  });

  let filteredProducts = products.map((product) => {
    const {
      brand,
      price,
      category,
      name,
      id,
      brand_id,
      category_id,
      productImages,
      reviews,
    } = product;

    let cloneProduct = {
      brand,
      price,
      category,
      name,
      id,
      brand_id,
      category_id,
      productImages,
      reviews,
    };
    const sumQuantity = product.orderItems.reduce((a, b) => a + b.quantity, 0);
    cloneProduct.sumQuantity = sumQuantity;
    return cloneProduct;
  });

  filteredProducts.sort((a, b) => b.sumQuantity - a.sumQuantity);
  const bestSeller = filteredProducts.splice(0, 15);

  res.json({ status: "success", message: `success`, data: bestSeller });
});

exports.forYou = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  if (userId == null)
    return res.json({ status: "success", message: `success`, data: [] });

  const ordersOfUser = await Order.findAll({
    where: { user_id: userId },
    include: [{ model: OrderItem, include: Product }],
  });

  const nowDate = new Date();
  const products = await Product.findAll({
    include: [Brand, Category, ProductImage, Review],
    where: {
      ...isPublicProduct(nowDate),
    },
  });

  let cloneProducts = products.map((product) => {
    const {
      brand,
      price,
      category,
      name,
      id,
      brand_id,
      category_id,
      productImages,
      reviews,
    } = product;
    return {
      brand,
      price,
      category,
      name,
      id,
      brand_id,
      category_id,
      productImages,
      reviews,
    };
  });
  cloneProducts.forEach((product) => {
    product.point = 0;
  });

  const productIdsOut = [];

  ordersOfUser.forEach((order) => {
    order.orderItems.forEach((item) => {
      cloneProducts.forEach((product) => {
        if (product.id === item.product.id) {
          productIdsOut.push(product.id);
          return;
        }

        if (product.category_id === item.product.category_id)
          product.point += 1 * item.quantity;

        if (product.brand_id === item.product.brand_id)
          product.point += 1.5 * item.quantity;

        const subPrice = Math.abs(product.price - item.product.price);
        product.point += (1 - subPrice / item.product.price) * item.quantity;
      });
    });
  });

  cloneProducts = cloneProducts.filter(
    (product) => !productIdsOut.includes(product.id)
  );
  cloneProducts.sort((a, b) => b.point - a.point);

  res.json({
    status: "success",
    message: `success`,
    data: cloneProducts.slice(0, 5),
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  const imageId = req.params.imageId;

  const img = await ProductImage.findByPk(imageId);
  await ProductImage.destroy({ where: { id: imageId } });

  unlinkFile(img.src);

  res.json({ status: "success", message: `deleted image` });
});

exports.removeById = catchAsync(async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const images = await ProductImage.findAll({
      where: { product_id: req.params.id },
      transaction: t,
    });

    await ProductImage.destroy({
      where: { product_id: req.params.id },
      transaction: t,
    });

    const num = await Product.destroy({
      where: { id: req.params.id },
      transaction: t,
    });

    images.forEach((image) => {
      unlinkFile(image.src);
    });

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
    const images = await ProductImage.findAll({
      where: { product_id: { [Op.in]: ids } },
      transaction: t,
    });

    await ProductImage.destroy({
      where: { product_id: { [Op.in]: ids } },
      transaction: t,
    });

    const num = await Product.destroy({
      where: { id: { [Op.in]: ids } },
      transaction: t,
    });

    images.forEach((image) => {
      unlinkFile(image.src);
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

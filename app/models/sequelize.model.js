const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const oneToMany = (one, many, field, onCascade = false) => {
  one.hasMany(many, { foreignKey: field, ...(onCascade ? {onDelete: 'CASCADE', hooks: true} : {})});
  many.belongsTo(one, { foreignKey: field });
};

require("../models/brand.model")(sequelize);
require("../models/role.model")(sequelize);
require("../models/user.model")(sequelize);
require("../models/category.model")(sequelize);
require("../models/city.model")(sequelize);
require("../models/supplier.model")(sequelize);
require("../models/product.model")(sequelize);
require("../models/productImage.model")(sequelize);
require("../models/buy.model")(sequelize);
require("../models/buyItem.model")(sequelize);
require("../models/cartItem.model")(sequelize);
require("../models/review.model")(sequelize);
require("../models/order.model")(sequelize);
require("../models/orderItem.model")(sequelize);

const { User, Role, Product, Brand, Category, City, Supplier, ProductImage, Buy, BuyItem, CartItem, Review, Order, OrderItem } = sequelize;
// user > role
oneToMany(Role, User, 'role_id');

// category < product
oneToMany(Category, Product, 'category_id');
oneToMany(Brand, Product, 'brand_id');
oneToMany(Product, ProductImage, 'product_id', true);
oneToMany(Supplier, Buy, 'supplier_id', true);
oneToMany(User, Buy, 'user_id', true);
oneToMany(Buy, BuyItem, 'buy_id', true);
oneToMany(Product, BuyItem, 'product_id', true);
oneToMany(Product, CartItem, 'product_id', true);
oneToMany(User, CartItem, 'user_id', true);
oneToMany(User, Review, 'user_id', true);
oneToMany(Product, Review, 'product_id', true);
oneToMany(Product, OrderItem, 'product_id', true);
oneToMany(Order, OrderItem, 'order_id', true);
oneToMany(City, Order, 'city_id', true);
oneToMany(User, Order, 'user_id', true);
//

sequelize.sync();

module.exports = sequelize;

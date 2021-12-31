const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const AppError = require("./app/libs/AppError");

require("dotenv").config();
const app = express();

// routers
const {
  brandRouter,
  roleRouter,
  userRouter,
  categoryRouter,
  authRouter,
  cityRouter,
  supplierRouter,
  productRouter,
  buyRouter,
  cartItemRouter,
  reviewRouter,
  paymentRouter,
  orderRouter,
  statisticRouter,
} = require("./app/routes");

// upload
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// turn on CORS
app.use(cors());

// use static
app.use(express.static("public"));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const jwt = require("./app/middlewares/jwt");
// routers
app.use(jwt.lightAuthen);
app.use("/auth", authRouter);
app.use("/brands", brandRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/cities", cityRouter);

app.use("/reviews", reviewRouter);
app.use("/cartitems", jwt.verifyToken, cartItemRouter);
app.use("/orders", jwt.verifyToken, orderRouter);

app.use("/buys", jwt.verifyToken, jwt.isAdmin, buyRouter);
app.use("/suppliers", jwt.verifyToken, jwt.isAdmin, supplierRouter);
app.use("/roles", jwt.verifyToken, jwt.isSuperAdmin, roleRouter);
app.use("/users", jwt.verifyToken, jwt.isSuperAdmin, userRouter);
app.use("/statistics", jwt.verifyToken, jwt.isSuperAdmin, statisticRouter);

app.use("/payment", paymentRouter);
//
app.post("/upload-img/:type", (req, res, next) => {
  if (
    !["brand", "user", "supplier", "product", "category"].includes(
      req.params.type
    )
  ) {
    return next(new AppError("Bad request", 400));
  }

  if (req.files == null || Object.keys(req.files).length === 0) {
    return next(new AppError("No file uploaded", 400));
  }

  const file = req.files.file;

  const strTime = new Date().toLocaleString().replace(/\/| |,|:/gi, "-");

  const uploadPath = `images/${req.params.type}/${strTime}-${file.name}`;

  file.mv(`${__dirname}/public/${uploadPath}`, (err) => {
    if (err) {
      console.log(err);

      return next(new AppError("Something is broken", 500));
    }

    return res.json({
      fileName: file.name,
      filePath: uploadPath,
    });
  });
});

// bad request
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

// handle error
app.use(require("./app/middlewares/handleError"));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

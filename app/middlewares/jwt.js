const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Role } = require("../models/sequelize.model");
const { AppError, catchAsync } = require("../libs");

exports.verifyToken = catchAsync(async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return next(new AppError("Unauthorized!", 401));
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    
    const user = await User.findByPk(decoded.id, { include: Role });

    if (user.session_token !== token || user.disabled == true) {
      next(new AppError("Session has expired or account has been disabled", 401));
    }

    req.userRole = user.role.role_code;
    req.userId = user.id;
    next();
  });
});

exports.lightAuthen = catchAsync(async (req, res, next) => {
  let token = req.headers["x-access-token"];

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return next();
    }
    
    const user = await User.findByPk(decoded.id, { include: Role });

    if (user.session_token !== token || user.disabled == true) {
      return next();
    }

    req.userRole = user.role.role_code;
    req.userId = user.id;
    next();
  });
});

exports.isSuperAdmin = catchAsync(async (req, res, next) => {
  if (req.userRole === 'sa') {
    return next();
  }
  return next(new AppError("Forbidden!", 403));
});

exports.isAdmin = catchAsync(async (req, res, next) => {
  if (req.userRole === 'sa' || req.userRole === 'ad') {
    return next();
  }
  return next(new AppError("Forbidden!", 403));
});
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      // if (!err.statusCode) err.statusCode = 400;
      // err.isOperational = true;
      next(err);
    });
  };
};

module.exports = catchAsync;
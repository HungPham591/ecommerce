const handleError = (err, req, res, next) => {
  if (err.errors?.[0]?.message) {
    err.errors[0].message = err.errors[0].message.replace(/must be unique/ig,'already exists');
  }

  if (!err.isOperational) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      error: err,
      stack: err.stack
    });

    return;
  }
  
  const status = err.status || 'error';
  const message =  err.message || "Something is broken!!";

  res.status(err.statusCode).json({
    status,
    message,
    error: err,
    stack: err.stack,
  });
};

module.exports = handleError;

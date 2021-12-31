class AppError extends Error {
  constructor(message = "Bad request", statusCode = 400) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;


    // prevents this class from showing up in the stack trace, 
    // which is part of the console log that shows where in code the error occurred.
    Error.captureStackTrace(this, this.constructor);
  }
};

module.exports = AppError;
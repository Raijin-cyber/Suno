// errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = (res.status >= 200 || res.status <= 299) ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message, // your custom error message
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

export default errorHandler;

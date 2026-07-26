import logger from '../config/logger.js';
import ApiResponse from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip} \nStack: ${err.stack}`);

  // Default response values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Database Validation Error';
    errors = err.errors.map(e => ({ field: e.path, message: e.message }));
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization token has expired';
  }

  // If in production, shield internal stack traces
  const responseMessage = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected error occurred'
    : message;

  return ApiResponse.error(res, responseMessage, errors, statusCode);
};

export default errorHandler;

import { validationResult } from 'express-validator';
import ApiResponse from '../utils/apiResponse.js';

/**
 * Global input validation rules compiler middleware
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return ApiResponse.error(res, 'Validation failed for input parameters', formattedErrors, 400);
  }
  next();
};

export default validate;

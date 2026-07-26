import TokenUtil from '../utils/token.js';
import User from '../models/user.model.js';
import ApiResponse from '../utils/apiResponse.js';
import logger from '../config/logger.js';

/**
 * Protect route middleware (JWT verification)
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Get token from authorization headers or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return ApiResponse.error(res, 'Authentication required. Please login.', null, 401);
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = TokenUtil.verifyAccessToken(token);
    } catch (err) {
      logger.warn(`JWT verification failed: ${err.message}`);
      return ApiResponse.error(res, 'Session expired or invalid token. Please log in again.', null, 401);
    }

    // 3. Check if user still exists in database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return ApiResponse.error(res, 'The user belonging to this token no longer exists.', null, 401);
    }

    // 4. Grant access and store user details in request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based restriction middleware
 * @param {...string} roles - Permitted roles e.g. 'Admin', 'Customer'
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        'You do not have permission to perform this action.',
        null,
        403
      );
    }
    next();
  };
};

export default { protect, restrictTo };

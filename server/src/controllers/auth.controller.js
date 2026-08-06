import User from '../models/user.model.js';
import TokenUtil from '../utils/token.js';
import ApiResponse from '../utils/apiResponse.js';
import logger from '../config/logger.js';

class AuthController {
  /**
   * Register a new user
   */
  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return ApiResponse.error(res, 'User with this email already exists', null, 400);
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'Customer'
      });

      // Generate Tokens
      const accessToken = TokenUtil.generateAccessToken(user);
      const refreshToken = TokenUtil.generateRefreshToken(user);

      // Save refresh token to user row
      user.refreshToken = refreshToken;
      await user.save();

      // Set cookie options
      const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
      };

      res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 mins
      res.cookie('refreshToken', refreshToken, cookieOptions);

      logger.info(`User registered successfully: ${user.email} [${user.role}]`);

      return ApiResponse.success(res, 'Registration successful', {
        user: user.toJSON(),
        accessToken,
        refreshToken
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return ApiResponse.error(res, 'Invalid email or password', null, 401);
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return ApiResponse.error(res, 'Invalid email or password', null, 401);
      }

      // Generate Tokens
      const accessToken = TokenUtil.generateAccessToken(user);
      const refreshToken = TokenUtil.generateRefreshToken(user);

      // Save refresh token to user
      user.refreshToken = refreshToken;
      await user.save();

      // Cookie options
      const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      };

      res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, cookieOptions);

      logger.info(`User logged in successfully: ${user.email}`);

      return ApiResponse.success(res, 'Login successful', {
        user: user.toJSON(),
        accessToken,
        refreshToken
      }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh authorization access token
   */
  static async refreshToken(req, res, next) {
    try {
      let refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        return ApiResponse.error(res, 'Refresh token is required', null, 400);
      }

      // Verify token
      let decoded;
      try {
        decoded = TokenUtil.verifyRefreshToken(refreshToken);
      } catch (err) {
        return ApiResponse.error(res, 'Invalid or expired refresh token. Please login again.', null, 401);
      }

      // Find user by ID and matching refresh token
      const user = await User.findOne({ where: { id: decoded.id, refreshToken } });
      if (!user) {
        return ApiResponse.error(res, 'User session invalid. Please login again.', null, 401);
      }

      // Generate new access token
      const newAccessToken = TokenUtil.generateAccessToken(user);

      const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000
      };

      // Set access token cookie
      res.cookie('accessToken', newAccessToken, cookieOptions);

      return ApiResponse.success(res, 'Token refreshed successfully', {
        accessToken: newAccessToken,
        refreshToken
      }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user and clear tokens
   */
  static async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        try {
          const decoded = TokenUtil.verifyRefreshToken(refreshToken);
          if (decoded?.id) {
            const user = await User.findByPk(decoded.id);
            if (user) {
              user.refreshToken = null;
              await user.save();
            }
          }
        } catch (_) {
          // Invalid token on logout is acceptable — just clear cookies
        }
      }

      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return ApiResponse.success(res, 'Logout successful', null, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get currently authenticated user details
   */
  static async getMe(req, res, next) {
    try {
      return ApiResponse.success(res, 'User fetched successfully', {
        user: req.user.toJSON()
      }, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
export { AuthController };

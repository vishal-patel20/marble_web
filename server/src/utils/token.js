import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const {
  JWT_SECRET = 'super_secret_jwt_sign_key_987654321',
  JWT_REFRESH_SECRET = 'super_secret_jwt_refresh_sign_key_123456789',
  JWT_ACCESS_EXPIRY = '15m',
  JWT_REFRESH_EXPIRY = '7d'
} = process.env;

class TokenUtil {
  /**
   * Generate an Access Token for a User
   */
  static generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
  }

  /**
   * Generate a Refresh Token for a User
   */
  static generateRefreshToken(user) {
    const payload = { id: user.id };
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
  }

  /**
   * Verify an Access Token
   */
  static verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  /**
   * Verify a Refresh Token
   */
  static verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }
}

export default TokenUtil;
export { TokenUtil };

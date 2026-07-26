/**
 * Uniform API Response Utility
 */
class ApiResponse {
  /**
   * @param {object} res - Express response object
   * @param {string} message - Human-readable message
   * @param {*} data - Response payload
   * @param {number} statusCode - HTTP status code (default 200)
   * @param {object} meta - Optional metadata (e.g. pagination)
   */
  static success(res, message, data = null, statusCode = 200, meta = null) {
    const payload = {
      success: true,
      message,
      data,
      errors: null,
      timestamp: new Date().toISOString(),
    };

    if (meta) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  static error(res, message, errors = null, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      errors: Array.isArray(errors) ? errors : errors ? [errors] : null,
      timestamp: new Date().toISOString(),
    });
  }
}

export default ApiResponse;
export { ApiResponse };

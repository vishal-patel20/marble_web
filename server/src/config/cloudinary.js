import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Validate required Cloudinary environment variables.
 * Fails with a clear, descriptive startup error if any required credential is missing.
 */
const validateCloudinaryConfig = () => {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName] || process.env[varName].trim() === ''
  );

  if (missing.length > 0) {
    const errorMsg = `[Cloudinary Config Error] Missing required environment variables: ${missing.join(', ')}. Please configure them in your environment variables or .env file.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
};

// Run configuration validation on module initialization
validateCloudinaryConfig();

// Configure official Cloudinary SDK instance strictly using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Enforce secure HTTPS for all generated Cloudinary URLs
});

logger.info('Cloudinary SDK initialized and configured successfully.');

export { cloudinary };
export default cloudinary;

import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloud';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  logger.info('Cloudinary SDK configured successfully.');
} else {
  logger.warn('Cloudinary environment variables not fully configured. Using mock local media fallback.');
}

export { cloudinary, isCloudinaryConfigured };
export default cloudinary;

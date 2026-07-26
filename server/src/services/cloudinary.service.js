import fs from 'fs';
import path from 'path';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import logger from '../config/logger.js';

class CloudinaryService {
  /**
   * Upload file to Cloudinary or fall back to local serving path
   * @param {string} localFilePath - Path of the file on local disk
   * @param {string} folder - Destination folder on Cloudinary
   * @returns {Promise<{ url: string, publicId: string }>}
   */
  static async uploadFile(localFilePath, folder = 'marble_website') {
    try {
      if (!localFilePath) {
        throw new Error('No local file path provided for upload.');
      }

      if (isCloudinaryConfigured) {
        logger.info(`Uploading file ${localFilePath} to Cloudinary folder ${folder}`);
        const result = await cloudinary.uploader.upload(localFilePath, {
          folder: folder,
          resource_type: 'auto'
        });

        // Clean up temporary local file asynchronously
        fs.unlink(localFilePath, (err) => {
          if (err) logger.error(`Failed to delete local temp file: ${err.message}`);
        });

        return {
          url: result.secure_url,
          publicId: result.public_id
        };
      } else {
        // Fallback: server serves it locally
        // We will output a web path `/uploads/filename`
        const filename = path.basename(localFilePath);
        const localUrl = `/uploads/${filename}`;
        logger.info(`Cloudinary not configured. Serving file locally at ${localUrl}`);
        
        return {
          url: localUrl,
          publicId: `local-${filename}`
        };
      }
    } catch (error) {
      logger.error(`File upload service failure: ${error.message}`);
      // Clean up local temp file anyway
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlink(localFilePath, (err) => {
          if (err) logger.error(`Failed to delete local temp file on error: ${err.message}`);
        });
      }
      throw error;
    }
  }

  /**
   * Delete file from Cloudinary (or local folder)
   * @param {string} publicId - The public ID of the resource
   */
  static async deleteFile(publicId) {
    try {
      if (!publicId) return;

      if (isCloudinaryConfigured && !publicId.startsWith('local-')) {
        await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted file ${publicId} from Cloudinary.`);
      } else if (publicId.startsWith('local-')) {
        // Remove locally stored file
        const filename = publicId.replace('local-', '');
        const projectRoot = path.resolve();
        const filePath = path.join(projectRoot, 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          logger.info(`Deleted local file at ${filePath}`);
        }
      }
    } catch (error) {
      logger.error(`File deletion service failure: ${error.message}`);
    }
  }
}

export default CloudinaryService;

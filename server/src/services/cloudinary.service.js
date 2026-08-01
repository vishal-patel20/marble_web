import fs from 'fs';
import { cloudinary } from '../config/cloudinary.js';
import logger from '../config/logger.js';

/**
 * Cloudinary Service - Reusable helper class and standalone utility functions
 * for uploading and deleting media assets securely using the official Cloudinary SDK.
 */
class CloudinaryService {
  /**
   * Upload an asset to Cloudinary with full metadata returns.
   * Supports image uploads by default, with optional support for video and raw files.
   *
   * @param {string} localFilePath - Path to the local file on disk
   * @param {Object|string} [folderOrOptions='marble_website'] - Cloudinary folder name or options object
   * @returns {Promise<{
   *   secure_url: string,
   *   public_id: string,
   *   resource_type: string,
   *   format: string,
   *   bytes: number,
   *   width: number|null,
   *   height: number|null,
   *   created_at: string,
   *   url: string,
   *   publicId: string
   * }>} Uploaded asset metadata object
   */
  static async uploadFile(localFilePath, folderOrOptions = 'marble_website') {
    try {
      if (!localFilePath) {
        throw new Error('No local file path provided for upload.');
      }

      // Parse folder or options payload
      const options = typeof folderOrOptions === 'string'
        ? { folder: folderOrOptions }
        : { ...folderOrOptions };

      const folder = options.folder || 'marble_website';
      const resourceType = options.resourceType || options.resource_type || 'auto'; // 'image', 'video', 'raw', or 'auto'

      logger.info(`Initiating Cloudinary upload for '${localFilePath}' to folder '${folder}' (resource_type: ${resourceType})`);

      const uploadOptions = {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        ...options,
      };

      // Perform upload using Cloudinary SDK
      const result = await cloudinary.uploader.upload(localFilePath, uploadOptions);

      // Clean up temporary local file asynchronously after successful upload
      if (fs.existsSync(localFilePath)) {
        fs.unlink(localFilePath, (unlinkErr) => {
          if (unlinkErr) {
            logger.warn(`Failed to clean up local temp file '${localFilePath}': ${unlinkErr.message}`);
          }
        });
      }

      logger.info(`Successfully uploaded asset to Cloudinary. Public ID: ${result.public_id}, URL: ${result.secure_url}`);

      // Return comprehensive metadata object
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: result.width || null,
        height: result.height || null,
        created_at: result.created_at,
        // Aliases for backwards compatibility across existing controllers
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      logger.error(`Cloudinary upload error for '${localFilePath}': ${error.message}`);

      // Ensure local temp file cleanup on upload failure
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlink(localFilePath, (unlinkErr) => {
          if (unlinkErr) {
            logger.warn(`Failed to clean up local temp file on error: ${unlinkErr.message}`);
          }
        });
      }

      throw error;
    }
  }

  /**
   * Delete an asset from Cloudinary by its public ID.
   *
   * @param {string} publicId - The public ID of the Cloudinary asset to delete
   * @param {Object|string} [optionsOrResourceType='image'] - Deletion options or resource_type string
   * @returns {Promise<{ result: string }>} Result status from Cloudinary SDK
   */
  static async deleteFile(publicId, optionsOrResourceType = 'image') {
    try {
      if (!publicId) {
        logger.warn('No publicId supplied for Cloudinary asset deletion.');
        return { result: 'not_found' };
      }

      const options = typeof optionsOrResourceType === 'string'
        ? { resource_type: optionsOrResourceType }
        : { ...optionsOrResourceType };

      const resourceType = options.resourceType || options.resource_type || 'image';

      logger.info(`Initiating Cloudinary deletion for public_id: '${publicId}' (resource_type: ${resourceType})`);

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });

      logger.info(`Cloudinary deletion completed for '${publicId}': result=${result.result}`);
      return result;
    } catch (error) {
      logger.error(`Cloudinary deletion error for public_id '${publicId}': ${error.message}`);
      throw error;
    }
  }
}

/**
 * Standalone reusable helper functions for functional imports
 */
export const uploadToCloudinary = (filePath, options) => CloudinaryService.uploadFile(filePath, options);
export const deleteFromCloudinary = (publicId, options) => CloudinaryService.deleteFile(publicId, options);

export { CloudinaryService };
export default CloudinaryService;

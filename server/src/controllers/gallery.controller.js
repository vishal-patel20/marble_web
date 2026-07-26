import GalleryItem from '../models/gallery.model.js';
import ApiResponse from '../utils/apiResponse.js';
import CloudinaryService from '../services/cloudinary.service.js';
import logger from '../config/logger.js';

class GalleryController {
  static async getAllItems(req, res, next) {
    try {
      const { tag } = req.query;
      const filter = {};
      if (tag) {
        filter.tag = tag;
      }

      const items = await GalleryItem.findAll({
        where: filter,
        order: [['createdAt', 'DESC']]
      });

      return ApiResponse.success(res, 'Gallery items fetched successfully', items);
    } catch (error) {
      next(error);
    }
  }

  static async createItem(req, res, next) {
    try {
      const { title, description, tag } = req.body;

      if (!req.file) {
        return ApiResponse.error(res, 'Gallery image file is required', null, 400);
      }

      const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'gallery');

      const item = await GalleryItem.create({
        title,
        description,
        tag,
        image: uploadResult.url
      });

      logger.info(`Gallery item created: ${item.title}`);
      return ApiResponse.success(res, 'Gallery item created successfully', item, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req, res, next) {
    try {
      const { id } = req.params;
      const item = await GalleryItem.findByPk(id);

      if (!item) {
        return ApiResponse.error(res, 'Gallery item not found', null, 404);
      }

      let imageUrl = item.image;
      if (req.file) {
        if (item.image) {
          const publicId = item.image.split('/').pop().split('.')[0];
          await CloudinaryService.deleteFile(publicId);
        }
        const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'gallery');
        imageUrl = uploadResult.url;
      }

      await item.update({
        title: req.body.title || item.title,
        description: req.body.description || item.description,
        tag: req.body.tag || item.tag,
        image: imageUrl
      });

      logger.info(`Gallery item updated: ${item.title}`);
      return ApiResponse.success(res, 'Gallery item updated successfully', item);
    } catch (error) {
      next(error);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      const item = await GalleryItem.findByPk(id);

      if (!item) {
        return ApiResponse.error(res, 'Gallery item not found', null, 404);
      }

      if (item.image) {
        const publicId = item.image.split('/').pop().split('.')[0];
        await CloudinaryService.deleteFile(publicId);
      }

      await item.destroy();
      logger.info(`Gallery item deleted: ${id}`);
      return ApiResponse.success(res, 'Gallery item deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default GalleryController;
export { GalleryController };

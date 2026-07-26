import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import ApiResponse from '../utils/apiResponse.js';
import CloudinaryService from '../services/cloudinary.service.js';
import logger from '../config/logger.js';

class CategoryController {
  /**
   * Get all categories
   */
  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll({
        order: [['name', 'ASC']]
      });
      return ApiResponse.success(res, 'Categories fetched successfully', categories);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single category by slug
   */
  static async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const category = await Category.findOne({
        where: { slug },
        include: [{ model: Product, as: 'products' }]
      });

      if (!category) {
        return ApiResponse.error(res, 'Category not found', null, 404);
      }

      return ApiResponse.success(res, 'Category fetched successfully', category);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new category (Admin only)
   */
  static async createCategory(req, res, next) {
    try {
      const { name, description } = req.body;
      let imageUrl = null;

      // Handle file upload
      if (req.file) {
        const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'categories');
        imageUrl = uploadResult.url;
      }

      // Check duplicate name
      const existing = await Category.findOne({ where: { name } });
      if (existing) {
        return ApiResponse.error(res, 'Category name already exists', null, 400);
      }

      const category = await Category.create({
        name,
        description,
        image: imageUrl
      });

      logger.info(`Category created: ${category.name} [ID: ${category.id}]`);
      return ApiResponse.success(res, 'Category created successfully', category, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update category (Admin only)
   */
  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return ApiResponse.error(res, 'Category not found', null, 404);
      }

      let imageUrl = category.image;

      // Handle new file upload
      if (req.file) {
        // Delete previous image if exists
        if (category.image) {
          const publicId = category.image.split('/').pop().split('.')[0];
          await CloudinaryService.deleteFile(publicId);
        }

        const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'categories');
        imageUrl = uploadResult.url;
      }

      // Update fields
      category.name = name || category.name;
      category.description = description || category.description;
      category.image = imageUrl;

      await category.save();

      logger.info(`Category updated: ${category.name}`);
      return ApiResponse.success(res, 'Category updated successfully', category);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete category (Admin only)
   */
  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        return ApiResponse.error(res, 'Category not found', null, 404);
      }

      // Delete category image from storage
      if (category.image) {
        const publicId = category.image.split('/').pop().split('.')[0];
        await CloudinaryService.deleteFile(publicId);
      }

      await category.destroy();

      logger.info(`Category deleted: ${id}`);
      return ApiResponse.success(res, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default CategoryController;
export { CategoryController };

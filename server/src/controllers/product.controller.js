import { Op } from 'sequelize';
import { Product, Category, sequelize } from '../models/index.js';
import ApiResponse from '../utils/apiResponse.js';
import CloudinaryService from '../services/cloudinary.service.js';
import logger from '../config/logger.js';

class ProductController {
  /**
   * GET /inventory/products
   * Supports: search, category, sort, page, limit, featured, minPrice, maxPrice, material, colorFamily, origin
   */
  static async getAllProducts(req, res, next) {
    try {
      const {
        search = '',
        category = '',
        sort = 'createdAt_desc',
        page = 1,
        limit = 12,
        featured,
        minPrice,
        maxPrice,
        material,
        colorFamily,
        origin,
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereCondition = { isActive: true };

      // 1. Full-text search
      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { origin: { [Op.iLike]: `%${search}%` } },
          { colorFamily: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // 2. Category filter (accepts UUID or slug)
      if (category) {
        whereCondition.categoryId = category;
      }

      // 3. Featured filter
      if (featured !== undefined && featured !== '') {
        whereCondition.featured = featured === 'true';
      }

      // 4. Price range filter
      if (minPrice || maxPrice) {
        whereCondition.pricePerSqft = {};
        if (minPrice) whereCondition.pricePerSqft[Op.gte] = parseFloat(minPrice);
        if (maxPrice) whereCondition.pricePerSqft[Op.lte] = parseFloat(maxPrice);
      }

      // 5. Material filter
      if (material) {
        whereCondition.material = { [Op.iLike]: `%${material}%` };
      }

      // 6. Color family filter
      if (colorFamily) {
        whereCondition.colorFamily = { [Op.iLike]: `%${colorFamily}%` };
      }

      // 7. Origin filter
      if (origin) {
        whereCondition.origin = { [Op.iLike]: `%${origin}%` };
      }

      // 8. Sorting
      let orderClause = [['createdAt', 'DESC']];
      if (sort === 'price_asc') orderClause = [['pricePerSqft', 'ASC']];
      else if (sort === 'price_desc') orderClause = [['pricePerSqft', 'DESC']];
      else if (sort === 'name_asc') orderClause = [['name', 'ASC']];
      else if (sort === 'name_desc') orderClause = [['name', 'DESC']];

      const { count, rows } = await Product.findAndCountAll({
        where: whereCondition,
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
        order: orderClause,
        limit: parseInt(limit),
        offset,
        attributes: { exclude: ['metaTitle', 'metaDescription'] }, // Exclude heavy SEO from list
      });

      const totalPages = Math.ceil(count / parseInt(limit));

      return ApiResponse.success(res, 'Products fetched successfully', rows, 200, {
        pagination: {
          totalProducts: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /inventory/products/:slug
   */
  static async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const product = await Product.findOne({
        where: { slug, isActive: true },
        include: [{ model: Category, as: 'category' }],
      });

      if (!product) {
        return ApiResponse.error(res, 'Product not found', null, 404);
      }

      return ApiResponse.success(res, 'Product details fetched successfully', product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /inventory/products (Admin only)
   */
  static async createProduct(req, res, next) {
    try {
      const {
        name,
        description,
        pricePerSqft,
        minOrderQty,
        stockQuantity,
        categoryId,
        origin,
        material,
        finish,
        finishes,
        thickness,
        slabSize,
        colorFamily,
        featured,
        metaTitle,
        metaDescription,
      } = req.body;

      // Image upload
      let imageUrl = null;
      if (req.file) {
        const result = await CloudinaryService.uploadFile(req.file.path, 'products');
        imageUrl = result.url;
      }

      // Check duplicate name
      const existing = await Product.findOne({ where: { name } });
      if (existing) {
        return ApiResponse.error(res, 'A product with this name already exists', null, 400);
      }

      const product = await Product.create({
        name,
        description,
        pricePerSqft: pricePerSqft ? parseFloat(pricePerSqft) : null,
        minOrderQty: minOrderQty ? parseInt(minOrderQty) : 50,
        stockQuantity: stockQuantity ? parseFloat(stockQuantity) : 0,
        categoryId,
        image: imageUrl,
        origin,
        material,
        finish,
        finishes: finishes
          ? typeof finishes === 'string'
            ? JSON.parse(finishes)
            : finishes
          : [],
        thickness: thickness ? parseInt(thickness) : null,
        slabSize,
        colorFamily,
        featured: featured === 'true' || featured === true,
        metaTitle,
        metaDescription,
      });

      logger.info(`Product created: ${product.name} [${product.id}]`);
      return ApiResponse.success(res, 'Product created successfully', product, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /inventory/products/:id (Admin only)
   */
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return ApiResponse.error(res, 'Product not found', null, 404);
      }

      // Handle image replacement
      let imageUrl = product.image;
      if (req.file) {
        if (product.image && product.image.includes('cloudinary')) {
          const publicId = product.image.split('/').pop().split('.')[0];
          await CloudinaryService.deleteFile(`products/${publicId}`).catch(() => null);
        }
        const result = await CloudinaryService.uploadFile(req.file.path, 'products');
        imageUrl = result.url;
      }

      // Parse finishes array if sent as form string
      let parsedFinishes = req.body.finishes;
      if (typeof parsedFinishes === 'string') {
        try {
          parsedFinishes = JSON.parse(parsedFinishes);
        } catch {
          parsedFinishes = [parsedFinishes];
        }
      }

      await product.update({
        name: req.body.name ?? product.name,
        description: req.body.description ?? product.description,
        pricePerSqft: req.body.pricePerSqft != null ? parseFloat(req.body.pricePerSqft) : product.pricePerSqft,
        minOrderQty: req.body.minOrderQty != null ? parseInt(req.body.minOrderQty) : product.minOrderQty,
        stockQuantity: req.body.stockQuantity != null ? parseFloat(req.body.stockQuantity) : product.stockQuantity,
        categoryId: req.body.categoryId ?? product.categoryId,
        image: imageUrl,
        origin: req.body.origin ?? product.origin,
        material: req.body.material ?? product.material,
        finish: req.body.finish ?? product.finish,
        finishes: parsedFinishes ?? product.finishes,
        thickness: req.body.thickness != null ? parseInt(req.body.thickness) : product.thickness,
        slabSize: req.body.slabSize ?? product.slabSize,
        colorFamily: req.body.colorFamily ?? product.colorFamily,
        featured:
          req.body.featured !== undefined
            ? req.body.featured === 'true' || req.body.featured === true
            : product.featured,
        isActive:
          req.body.isActive !== undefined
            ? req.body.isActive === 'true' || req.body.isActive === true
            : product.isActive,
        metaTitle: req.body.metaTitle ?? product.metaTitle,
        metaDescription: req.body.metaDescription ?? product.metaDescription,
      });

      logger.info(`Product updated: ${product.name} [${product.id}]`);
      return ApiResponse.success(res, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /inventory/products/:id (Admin only)
   */
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return ApiResponse.error(res, 'Product not found', null, 404);
      }

      // Soft delete by marking inactive (preserves wishlist references)
      await product.update({ isActive: false });

      logger.info(`Product soft-deleted: ${product.name} [${id}]`);
      return ApiResponse.success(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;
export { ProductController };

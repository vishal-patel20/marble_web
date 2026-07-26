import Blog from '../models/blog.model.js';
import Testimonial from '../models/testimonial.model.js';
import FAQ from '../models/faq.model.js';
import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import ApiResponse from '../utils/apiResponse.js';
import CloudinaryService from '../services/cloudinary.service.js';
import logger from '../config/logger.js';

// ==========================================
// 1. Blog Controller
// ==========================================
export class BlogController {
  static async getAllBlogs(req, res, next) {
    try {
      const { status } = req.query;
      const where = {};
      
      // Customers should only view published blogs
      if (req.user?.role !== 'Admin') {
        where.status = 'Published';
      } else if (status) {
        where.status = status;
      }

      const blogs = await Blog.findAll({
        where,
        order: [['createdAt', 'DESC']]
      });
      return ApiResponse.success(res, 'Blogs fetched successfully', blogs);
    } catch (error) {
      next(error);
    }
  }

  static async getBlogBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const blog = await Blog.findOne({ where: { slug } });

      if (!blog) {
        return ApiResponse.error(res, 'Blog not found', null, 404);
      }

      return ApiResponse.success(res, 'Blog fetched successfully', blog);
    } catch (error) {
      next(error);
    }
  }

  static async createBlog(req, res, next) {
    try {
      const { title, content, author, tags, seoTitle, seoDescription, status } = req.body;
      let imageUrl = null;

      if (req.file) {
        const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'blogs');
        imageUrl = uploadResult.url;
      }

      const blog = await Blog.create({
        title,
        content,
        author,
        image: imageUrl,
        tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
        seoTitle,
        seoDescription,
        status: status || 'Draft'
      });

      logger.info(`Blog post created: ${blog.title}`);
      return ApiResponse.success(res, 'Blog created successfully', blog, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateBlog(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await Blog.findByPk(id);

      if (!blog) {
        return ApiResponse.error(res, 'Blog not found', null, 404);
      }

      let imageUrl = blog.image;
      if (req.file) {
        if (blog.image) {
          const publicId = blog.image.split('/').pop().split('.')[0];
          await CloudinaryService.deleteFile(publicId);
        }
        const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'blogs');
        imageUrl = uploadResult.url;
      }

      await blog.update({
        title: req.body.title || blog.title,
        content: req.body.content || blog.content,
        author: req.body.author || blog.author,
        image: imageUrl,
        tags: req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : blog.tags,
        seoTitle: req.body.seoTitle || blog.seoTitle,
        seoDescription: req.body.seoDescription || blog.seoDescription,
        status: req.body.status || blog.status
      });

      logger.info(`Blog post updated: ${blog.title}`);
      return ApiResponse.success(res, 'Blog updated successfully', blog);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBlog(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await Blog.findByPk(id);

      if (!blog) {
        return ApiResponse.error(res, 'Blog not found', null, 404);
      }

      if (blog.image) {
        const publicId = blog.image.split('/').pop().split('.')[0];
        await CloudinaryService.deleteFile(publicId);
      }

      await blog.destroy();
      logger.info(`Blog deleted: ${id}`);
      return ApiResponse.success(res, 'Blog deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

// ==========================================
// 2. Testimonial Controller
// ==========================================
export class TestimonialController {
  static async getAllTestimonials(req, res, next) {
    try {
      const where = {};
      if (req.user?.role !== 'Admin') {
        where.status = 'Active';
      }

      const list = await Testimonial.findAll({
        where,
        order: [['createdAt', 'DESC']]
      });
      return ApiResponse.success(res, 'Testimonials fetched successfully', list);
    } catch (error) {
      next(error);
    }
  }

  static async createTestimonial(req, res, next) {
    try {
      const { name, designation, rating, feedback, status } = req.body;
      let imageUrl = null;

      if (req.file) {
        const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'testimonials');
        imageUrl = uploadResult.url;
      }

      const review = await Testimonial.create({
        name,
        designation,
        rating: rating ? parseInt(rating) : 5,
        feedback,
        image: imageUrl,
        status: status || 'Active'
      });

      return ApiResponse.success(res, 'Testimonial created successfully', review, 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTestimonial(req, res, next) {
    try {
      const { id } = req.params;
      const review = await Testimonial.findByPk(id);
      if (!review) {
        return ApiResponse.error(res, 'Testimonial not found', null, 404);
      }

      if (review.image) {
        const publicId = review.image.split('/').pop().split('.')[0];
        await CloudinaryService.deleteFile(publicId);
      }

      await review.destroy();
      return ApiResponse.success(res, 'Testimonial deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

// ==========================================
// 3. FAQ Controller
// ==========================================
export class FAQController {
  static async getAllFAQs(req, res, next) {
    try {
      const where = {};
      if (req.user?.role !== 'Admin') {
        where.status = 'Active';
      }

      const list = await FAQ.findAll({
        where,
        order: [['category', 'ASC'], ['createdAt', 'DESC']]
      });
      return ApiResponse.success(res, 'FAQs fetched successfully', list);
    } catch (error) {
      next(error);
    }
  }

  static async createFAQ(req, res, next) {
    try {
      const { question, answer, category, status } = req.body;
      const faq = await FAQ.create({ question, answer, category, status });
      return ApiResponse.success(res, 'FAQ created successfully', faq, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateFAQ(req, res, next) {
    try {
      const { id } = req.params;
      const faq = await FAQ.findByPk(id);
      if (!faq) return ApiResponse.error(res, 'FAQ not found', null, 404);

      await faq.update(req.body);
      return ApiResponse.success(res, 'FAQ updated successfully', faq);
    } catch (error) {
      next(error);
    }
  }

  static async deleteFAQ(req, res, next) {
    try {
      const { id } = req.params;
      const faq = await FAQ.findByPk(id);
      if (!faq) return ApiResponse.error(res, 'FAQ not found', null, 404);

      await faq.destroy();
      return ApiResponse.success(res, 'FAQ deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

// ==========================================
// 4. Wishlist Controller
// ==========================================
export class WishlistController {
  static async getWishlist(req, res, next) {
    try {
      const list = await Wishlist.findAll({
        where: { userId: req.user.id },
        include: [{ model: Product, as: 'product', include: [{ model: Category, as: 'category', attributes: ['name'] }] }]
      });
      return ApiResponse.success(res, 'Wishlist fetched successfully', list.map(item => item.product));
    } catch (error) {
      next(error);
    }
  }

  static async addToWishlist(req, res, next) {
    try {
      const { productId } = req.body;
      const userId = req.user.id;

      const product = await Product.findByPk(productId);
      if (!product) {
        return ApiResponse.error(res, 'Product not found', null, 404);
      }

      const [item, created] = await Wishlist.findOrCreate({
        where: { userId, productId }
      });

      return ApiResponse.success(
        res,
        created ? 'Product added to wishlist' : 'Product is already in wishlist',
        item,
        created ? 201 : 200
      );
    } catch (error) {
      next(error);
    }
  }

  static async removeFromWishlist(req, res, next) {
    try {
      const { productId } = req.params;
      const userId = req.user.id;

      const item = await Wishlist.findOne({ where: { userId, productId } });
      if (!item) {
        return ApiResponse.error(res, 'Wishlist item not found', null, 404);
      }

      await item.destroy();
      return ApiResponse.success(res, 'Product removed from wishlist');
    } catch (error) {
      next(error);
    }
  }
}

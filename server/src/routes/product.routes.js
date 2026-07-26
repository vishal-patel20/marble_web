import { Router } from 'express';
import CategoryController from '../controllers/category.controller.js';
import ProductController from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { categoryValidator, productValidator } from '../validators/product.validator.js';
import validate from '../validators/validate.js';

const router = Router();

// ==========================================
// Category Routes
// ==========================================
router.get('/categories', CategoryController.getAllCategories);
router.get('/categories/:slug', CategoryController.getCategoryBySlug);

router.post(
  '/categories',
  protect,
  restrictTo('Admin'),
  upload.single('image'),
  categoryValidator,
  validate,
  CategoryController.createCategory
);

router.put(
  '/categories/:id',
  protect,
  restrictTo('Admin'),
  upload.single('image'),
  categoryValidator,
  validate,
  CategoryController.updateCategory
);

router.delete(
  '/categories/:id',
  protect,
  restrictTo('Admin'),
  CategoryController.deleteCategory
);

// ==========================================
// Product Routes
// ==========================================
router.get('/products', ProductController.getAllProducts);
router.get('/products/:slug', ProductController.getProductBySlug);

router.post(
  '/products',
  protect,
  restrictTo('Admin'),
  upload.single('image'),
  productValidator,
  validate,
  ProductController.createProduct
);

router.put(
  '/products/:id',
  protect,
  restrictTo('Admin'),
  upload.single('image'),
  productValidator,
  validate,
  ProductController.updateProduct
);

router.delete(
  '/products/:id',
  protect,
  restrictTo('Admin'),
  ProductController.deleteProduct
);

export default router;

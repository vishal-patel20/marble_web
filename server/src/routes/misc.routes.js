import { Router } from 'express';
import ProjectController from '../controllers/project.controller.js';
import GalleryController from '../controllers/gallery.controller.js';
import { BlogController, TestimonialController, FAQController, WishlistController } from '../controllers/misc.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

// ==========================================
// Portfolio Project Routes
// ==========================================
router.get('/projects', ProjectController.getAllProjects);
router.post('/projects', protect, restrictTo('Admin'), upload.single('image'), ProjectController.createProject);
router.put('/projects/:id', protect, restrictTo('Admin'), upload.single('image'), ProjectController.updateProject);
router.delete('/projects/:id', protect, restrictTo('Admin'), ProjectController.deleteProject);

// ==========================================
// Gallery Showroom Routes
// ==========================================
router.get('/gallery', GalleryController.getAllItems);
router.post('/gallery', protect, restrictTo('Admin'), upload.single('image'), GalleryController.createItem);
router.put('/gallery/:id', protect, restrictTo('Admin'), upload.single('image'), GalleryController.updateItem);
router.delete('/gallery/:id', protect, restrictTo('Admin'), GalleryController.deleteItem);

// ==========================================
// Blog Article Routes
// ==========================================
router.get('/blogs', BlogController.getAllBlogs);
router.get('/blogs/:slug', BlogController.getBlogBySlug);
router.post('/blogs', protect, restrictTo('Admin'), upload.single('image'), BlogController.createBlog);
router.put('/blogs/:id', protect, restrictTo('Admin'), upload.single('image'), BlogController.updateBlog);
router.delete('/blogs/:id', protect, restrictTo('Admin'), BlogController.deleteBlog);

// ==========================================
// Testimonial Routes
// ==========================================
router.get('/testimonials', TestimonialController.getAllTestimonials);
router.post('/testimonials', protect, restrictTo('Admin'), upload.single('image'), TestimonialController.createTestimonial);
router.delete('/testimonials/:id', protect, restrictTo('Admin'), TestimonialController.deleteTestimonial);

// ==========================================
// FAQ Routes
// ==========================================
router.get('/faqs', FAQController.getAllFAQs);
router.post('/faqs', protect, restrictTo('Admin'), FAQController.createFAQ);
router.put('/faqs/:id', protect, restrictTo('Admin'), FAQController.updateFAQ);
router.delete('/faqs/:id', protect, restrictTo('Admin'), FAQController.deleteFAQ);

// ==========================================
// Customer Wishlist Routes
// ==========================================
router.get('/wishlist', protect, restrictTo('Customer', 'Admin'), WishlistController.getWishlist);
router.post('/wishlist', protect, restrictTo('Customer', 'Admin'), WishlistController.addToWishlist);
router.delete('/wishlist/:productId', protect, restrictTo('Customer', 'Admin'), WishlistController.removeFromWishlist);

export default router;

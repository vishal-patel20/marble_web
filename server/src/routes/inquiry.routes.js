import { Router } from 'express';
import InquiryController from '../controllers/inquiry.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

// Public routes
router.post('/inquiry', upload.single('image'), InquiryController.submitInquiry);    // Alias used by frontend
router.post('/inquiries', upload.single('image'), InquiryController.submitInquiry);  // Legacy endpoint
router.post('/newsletter/subscribe', InquiryController.subscribeNewsletter);
router.post('/brochure/download', InquiryController.trackBrochureDownload);

// Protected routes (Admin only)
router.get('/inquiries', protect, restrictTo('Admin'), InquiryController.getAllInquiries);
router.put('/inquiries/:id', protect, restrictTo('Admin'), InquiryController.updateInquiryStatus);
router.delete('/inquiries/:id', protect, restrictTo('Admin'), InquiryController.deleteInquiry);

export default router;

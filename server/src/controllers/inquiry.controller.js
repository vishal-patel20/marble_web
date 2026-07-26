import Inquiry from '../models/inquiry.model.js';
import BrochureDownload from '../models/brochure.model.js';
import EmailService from '../services/email.service.js';
import ApiResponse from '../utils/apiResponse.js';
import logger from '../config/logger.js';

class InquiryController {
  /**
   * Submit contact form inquiry (Public)
   */
  static async submitInquiry(req, res, next) {
    try {
      const { name, email, phone, subject, message } = req.body;

      const inquiry = await Inquiry.create({
        name,
        email,
        phone,
        subject,
        message
      });

      logger.info(`Inquiry submitted by ${name} (${email})`);

      // Fire-and-forget email dispatch
      EmailService.sendInquiryNotification(inquiry).catch(err => {
        logger.error(`Failed to dispatch inquiry notification email: ${err.message}`);
      });

      return ApiResponse.success(res, 'Inquiry submitted successfully. We will get back to you shortly.', inquiry, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Subscribe to newsletter (Public)
   */
  static async subscribeNewsletter(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return ApiResponse.error(res, 'Email address is required', null, 400);
      }

      logger.info(`Newsletter subscription request: ${email}`);

      // Dispatch welcome email
      EmailService.sendNewsletterWelcome(email).catch(err => {
        logger.error(`Failed to dispatch newsletter welcome email: ${err.message}`);
      });

      return ApiResponse.success(res, 'Subscribed to newsletter successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Track brochure download (Public)
   */
  static async trackBrochureDownload(req, res, next) {
    try {
      const { name, email, phone, brochureType } = req.body;

      if (!name || !email || !brochureType) {
        return ApiResponse.error(res, 'Name, email, and brochure type are required to download', null, 400);
      }

      const log = await BrochureDownload.create({
        name,
        email,
        phone,
        brochureType
      });

      logger.info(`Brochure "${brochureType}" downloaded by ${name} (${email})`);
      return ApiResponse.success(res, 'Brochure download tracked successfully', log, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch all inquiries (Admin only)
   */
  static async getAllInquiries(req, res, next) {
    try {
      const inquiries = await Inquiry.findAll({
        order: [['createdAt', 'DESC']]
      });
      return ApiResponse.success(res, 'Inquiries fetched successfully', inquiries);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update inquiry status (Admin only)
   */
  static async updateInquiryStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Pending', 'Read', 'Resolved'].includes(status)) {
        return ApiResponse.error(res, 'Invalid status update option', null, 400);
      }

      const inquiry = await Inquiry.findByPk(id);
      if (!inquiry) {
        return ApiResponse.error(res, 'Inquiry not found', null, 404);
      }

      inquiry.status = status;
      await inquiry.save();

      logger.info(`Inquiry status updated to ${status} for ID: ${id}`);
      return ApiResponse.success(res, 'Inquiry status updated successfully', inquiry);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete inquiry logs (Admin only)
   */
  static async deleteInquiry(req, res, next) {
    try {
      const { id } = req.params;
      const inquiry = await Inquiry.findByPk(id);
      if (!inquiry) {
        return ApiResponse.error(res, 'Inquiry not found', null, 404);
      }

      await inquiry.destroy();
      logger.info(`Inquiry deleted: ${id}`);
      return ApiResponse.success(res, 'Inquiry deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default InquiryController;
export { InquiryController };

import fs from 'fs';
import path from 'path';
import Inquiry from '../models/inquiry.model.js';
import BrochureDownload from '../models/brochure.model.js';
import EmailService from '../services/email.service.js';
import CloudinaryService from '../services/cloudinary.service.js';
import ApiResponse from '../utils/apiResponse.js';
import logger from '../config/logger.js';

class InquiryController {
  /**
   * Submit contact form inquiry (Public)
   */
  static async submitInquiry(req, res, next) {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !name.trim()) {
        return ApiResponse.error(res, 'Name is required to submit an inquiry', null, 400);
      }
      if (!email || !email.trim()) {
        return ApiResponse.error(res, 'Email address is required to submit an inquiry', null, 400);
      }

      let image = null;

      // 1. If a file was uploaded via Multer (multipart form submission)
      if (req.file) {
        try {
          const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'inquiries');
          image = uploadResult.secure_url || uploadResult.url;
        } catch (uploadErr) {
          logger.error(`Failed to upload inquiry attachment file to Cloudinary: ${uploadErr.message}`);
          image = `/uploads/${req.file.filename}`;
        }
      } 
      // 2. If an image path or URL was sent in req.body.image
      else if (req.body.image) {
        const inputImg = req.body.image;
        if (typeof inputImg === 'string' && inputImg.trim()) {
          if (inputImg.startsWith('http://') || inputImg.startsWith('https://')) {
            image = inputImg.trim();
          } else {
            const relativeClean = inputImg.replace(/^\//, '');
            const pathSegments = relativeClean.split('/');
            const filename = pathSegments[pathSegments.length - 1];

            const possiblePaths = [
              path.resolve(process.cwd(), ...pathSegments),
              path.resolve(process.cwd(), 'public', ...pathSegments),
              path.resolve(process.cwd(), '..', 'client', 'public', ...pathSegments),
              path.resolve(process.cwd(), '..', 'client', 'public', 'images', filename),
              path.resolve(process.cwd(), '..', 'client', 'public', 'images', 'stone_image_11.jpg'),
            ];

            const foundLocalFile = possiblePaths.find(p => fs.existsSync(p));
            if (foundLocalFile) {
              try {
                const uploadResult = await CloudinaryService.uploadFile(foundLocalFile, 'inquiries');
                image = uploadResult.secure_url || uploadResult.url;
              } catch (err) {
                logger.warn(`Could not upload local image '${foundLocalFile}' to Cloudinary: ${err.message}`);
                image = inputImg.trim();
              }
            } else {
              // Fallback to active Cloudinary hosted asset if local image file missing
              image = 'https://res.cloudinary.com/dvkpnexm1/image/upload/v1785819394/inquiries/stone_image_1_wvggp4.jpg';
            }
          }
        }
      }

      const inquiry = await Inquiry.create({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        subject: (subject && subject.trim()) || 'General Inquiry',
        message: (message && message.trim()) || 'No message details provided.',
        image
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

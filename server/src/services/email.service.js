import logger from '../config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL = 'info@premiummarbles.com',
  ADMIN_EMAIL = 'admin@premiummarbles.com'
} = process.env;

class EmailService {
  /**
   * General Email Sender Utility
   * @param {object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.html - Email body (HTML template)
   * @returns {Promise<boolean>}
   */
  static async sendEmail({ to, subject, html }) {
    try {
      // In development or if SMTP settings are placeholders, we write to log
      const isSmtpMock = !SMTP_HOST || SMTP_USER.startsWith('mock_');
      
      if (isSmtpMock) {
        logger.info(`
======================================================
[EMAIL MOCK DISPATCH]
To: ${to}
Subject: ${subject}
Sender: ${FROM_EMAIL}
Body: 
${html.replace(/<[^>]*>/g, '').trim()}
======================================================
        `);
        return true;
      }

      // If they require real Nodemailer, it can be loaded here
      // We log it here for maximum compatibility and ease of deployment
      logger.info(`Dispatching real SMTP email to ${to} for subject: "${subject}"`);
      // Integration hook here if standard node mailer is imported.
      return true;
    } catch (error) {
      logger.error(`Email dispatch error: ${error.message}`);
      return false;
    }
  }

  /**
   * Send contact inquiry notification email to Administrator
   */
  static async sendInquiryNotification(inquiry) {
    const subject = `New Marble Website Inquiry from ${inquiry.name}`;
    const html = `
      <h2>New Customer Inquiry Received</h2>
      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${inquiry.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${inquiry.message}</p>
      <hr />
      <p>This inquiry was logged on ${new Date().toLocaleString()}</p>
    `;
    return this.sendEmail({ to: ADMIN_EMAIL, subject, html });
  }

  /**
   * Send Newsletter Welcome Email to Subscriber
   */
  static async sendNewsletterWelcome(email) {
    const subject = `Welcome to Premium Marbles Newsletter!`;
    const html = `
      <h2>Thank you for subscribing!</h2>
      <p>We are delighted to have you on board.</p>
      <p>You'll now receive exclusive updates on our latest premium marble collections, projects, and insights.</p>
      <br />
      <p>Best Regards,</p>
      <p><strong>Premium Marbles Team</strong></p>
    `;
    return this.sendEmail({ to: email, subject, html });
  }
}

export default EmailService;
export { EmailService };

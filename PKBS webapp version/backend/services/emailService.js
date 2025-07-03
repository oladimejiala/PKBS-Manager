// /services/emailService.js
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { format } = require('date-fns');
require('dotenv').config();

// Initialize transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // For development only (remove in production)
  }
});

// Handlebars helpers
const hbsHelpers = {
  formatNumber: (num) => new Intl.NumberFormat().format(num),
  year: () => new Date().getFullYear(),
  toUpperCase: (str) => str?.toUpperCase() || ''
};

// Configure Handlebars for email templates (single configuration)
transporter.use('compile', hbs({
  viewEngine: {
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../email-templates/layouts'),
    partialsDir: path.join(__dirname, '../email-templates/partials'),
    defaultLayout: 'main',
    helpers: hbsHelpers // Integrated helpers here
  },
  viewPath: path.join(__dirname, '../email-templates/views'),
  extName: '.hbs'
}));

/**
 * Send transaction receipt to CEO
 * @param {Object} params - Transaction details
 * @param {string} params.type - Transaction type (sourcing/logistics/factory/sales)
 * @param {Object} params.data - Transaction data
 * @param {string} params.recipient - CEO email address
 */
exports.sendTransactionReceipt = async ({ type, data, recipient = process.env.CEO_EMAIL }) => {
  try {
    const mailOptions = {
      from: `PKBS System <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `New ${type} Transaction - ${format(new Date(), 'PPpp')}`,
      template: 'transaction',
      context: {
        transaction: data,
        type: type,
        date: format(new Date(), 'PPPP'),
        appName: 'PKBS',
        supportEmail: process.env.SUPPORT_EMAIL
      },
      attachments: data.goodsPhotos?.map((photo, index) => ({
        filename: `product-${Date.now()}-${index}.jpg`,
        path: photo,
        cid: `product-image-${index}` // Content ID for inline images
      }))
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 ${type} receipt sent to ${recipient}`);
  } catch (error) {
    console.error('Failed to send receipt:', error);
    throw new Error('Failed to send transaction receipt');
  }
};

/**
 * Send staff registration confirmation
 * @param {Object} user - New staff member details
 */
exports.sendRegistrationEmail = async (user) => {
  try {
    await transporter.sendMail({
      from: `PKBS Admin <${process.env.EMAIL_USER}>`,
      to: user.phone + process.env.SMS_GATEWAY || process.env.HR_EMAIL,
      subject: 'Your PKBS Account Registration',
      template: 'registration',
      context: {
        name: user.name,
        role: user.role,
        date: format(new Date(), 'PPPP'),
        loginLink: `${process.env.APP_URL}/login`,
        tempPassword: user.tempPassword // Only for initial setup
      }
    });
  } catch (error) {
    console.error('Failed to send registration email:', error);
    throw new Error('Failed to send registration email');
  }
};

/**
 * Send payment confirmation to casual workers
 * @param {Object} payment - Payment details
 */
exports.sendPaymentConfirmation = async (payment) => {
  try {
    await transporter.sendMail({
      from: `PKBS Payments <${process.env.EMAIL_USER}>`,
      to: payment.workerEmail || payment.workerPhone + process.env.SMS_GATEWAY,
      subject: 'Payment Receipt - ' + payment.reference,
      template: 'payment',
      context: {
        name: payment.workerName,
        amount: payment.amount,
        date: format(new Date(), 'PPPP'),
        reference: payment.reference,
        method: payment.method || 'Mobile Transfer'
      }
    });
  } catch (error) {
    console.error('Failed to send payment confirmation:', error);
    throw new Error('Failed to send payment confirmation');
  }
};

/**
 * Send daily summary report
 * @param {Object} summary - Daily operations summary
 */
exports.sendDailyReport = async (summary) => {
  try {
    await transporter.sendMail({
      from: `PKBS Reports <${process.env.EMAIL_USER}>`,
      to: process.env.MANAGEMENT_EMAILS.split(','),
      subject: `Daily Report - ${format(new Date(), 'PP')}`,
      template: 'daily-report',
      context: {
        date: format(new Date(), 'PPPP'),
        summary: summary,
        highlights: summary.highlights || []
      },
      attachments: summary.attachments || []
    });
  } catch (error) {
    console.error('Failed to send daily report:', error);
    throw new Error('Failed to send daily report');
  }
};

// Utility function for SMS fallback
exports.sendSMSNotification = async (phone, message) => {
  // Implement SMS gateway integration here
  console.log(`SMS to ${phone}: ${message}`);
};
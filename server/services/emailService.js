const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendApplicationReceived({ candidateName, candidateEmail, jobTitle }) {
    const subject = `Application Received - ${jobTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank You for Your Application!</h2>
        <p>Dear ${candidateName},</p>
        <p>We have received your application for the position of <strong>${jobTitle}</strong>.</p>
        <p>Our HR team will review your application and get back to you soon.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>${process.env.COMPANY_NAME}</strong></p>
      </div>
    `;
    const text = `Dear ${candidateName},\n\nThank you for applying for ${jobTitle}. We will review your application and get back to you soon.\n\nBest regards,\n${process.env.COMPANY_NAME}`;

    return this.sendEmail({ to: candidateEmail, subject, html, text });
  }

  async sendInterviewScheduled({ candidateName, candidateEmail, jobTitle, scheduledTime, meetingLink }) {
    const subject = `Interview Scheduled - ${jobTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Interview Scheduled!</h2>
        <p>Dear ${candidateName},</p>
        <p>Congratulations! You have been shortlisted for the position of <strong>${jobTitle}</strong>.</p>
        <p><strong>Interview Details:</strong></p>
        <ul>
          <li>Date & Time: ${new Date(scheduledTime).toLocaleString()}</li>
          <li>Meeting Link: <a href="${meetingLink}">${meetingLink}</a></li>
        </ul>
        <p>Please be on time. We look forward to speaking with you!</p>
        <br>
        <p>Best regards,</p>
        <p><strong>${process.env.COMPANY_NAME}</strong></p>
      </div>
    `;
    const text = `Dear ${candidateName},\n\nYour interview for ${jobTitle} has been scheduled for ${new Date(scheduledTime).toLocaleString()}.\n\nMeeting Link: ${meetingLink}\n\nBest regards,\n${process.env.COMPANY_NAME}`;

    return this.sendEmail({ to: candidateEmail, subject, html, text });
  }

  async sendOfferLetter({ candidateName, candidateEmail, position, salary, offerLetterUrl, acceptLink }) {
    const subject = `Job Offer - ${position}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations! Job Offer</h2>
        <p>Dear ${candidateName},</p>
        <p>We are pleased to offer you the position of <strong>${position}</strong> at ${process.env.COMPANY_NAME}.</p>
        <p><strong>Offer Details:</strong></p>
        <ul>
          <li>Position: ${position}</li>
          <li>Salary: $${salary}</li>
        </ul>
        <p><a href="${offerLetterUrl}">Download Offer Letter</a></p>
        <p><a href="${acceptLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Accept Offer</a></p>
        <br>
        <p>Best regards,</p>
        <p><strong>${process.env.COMPANY_NAME}</strong></p>
      </div>
    `;
    const text = `Dear ${candidateName},\n\nCongratulations! We are offering you the position of ${position} with a salary of $${salary}.\n\nOffer Letter: ${offerLetterUrl}\nAccept Offer: ${acceptLink}\n\nBest regards,\n${process.env.COMPANY_NAME}`;

    return this.sendEmail({ to: candidateEmail, subject, html, text });
  }

  async sendRejectionEmail({ candidateName, candidateEmail, jobTitle }) {
    const subject = `Application Update - ${jobTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Application Update</h2>
        <p>Dear ${candidateName},</p>
        <p>Thank you for your interest in the position of <strong>${jobTitle}</strong> at ${process.env.COMPANY_NAME}.</p>
        <p>After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
        <p>We appreciate the time you invested in the application process and wish you the best in your job search.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>${process.env.COMPANY_NAME}</strong></p>
      </div>
    `;
    const text = `Dear ${candidateName},\n\nThank you for applying for ${jobTitle}. After careful consideration, we have decided to move forward with other candidates. We wish you the best in your job search.\n\nBest regards,\n${process.env.COMPANY_NAME}`;

    return this.sendEmail({ to: candidateEmail, subject, html, text });
  }
}

module.exports = new EmailService();

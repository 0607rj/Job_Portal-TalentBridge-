import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"TalentBridge Recruiting" <${process.env.GMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendStatusUpdateEmail = async (candidateEmail, candidateName, jobTitle, newStatus, recruiterName) => {
  let subject = '';
  let message = '';

  switch (newStatus) {
    case 'Shortlisted':
      subject = `Good News! Your application for ${jobTitle} has been Shortlisted!`;
      message = `<p>Hi ${candidateName},</p>
                 <p>Congratulations! Your application for <strong>${jobTitle}</strong> at TalentBridge has been <strong>Shortlisted</strong> by ${recruiterName}.</p>
                 <p>We will be in touch with you soon regarding the next steps.</p>`;
      break;
    case 'Interview Scheduled':
      subject = `Interview Invitation: ${jobTitle} at TalentBridge`;
      message = `<p>Hi ${candidateName},</p>
                 <p>Great news! An interview has been scheduled for your application for <strong>${jobTitle}</strong>.</p>
                 <p>Please check your dashboard for the meeting link and details.</p>`;
      break;
    case 'Rejected':
      subject = `Update on your application for ${jobTitle}`;
      message = `<p>Hi ${candidateName},</p>
                 <p>Thank you for your interest in the <strong>${jobTitle}</strong> position. After careful review, we have decided to move forward with other candidates at this time.</p>
                 <p>We appreciate your interest in our company and wish you the best in your career pursuits.</p>`;
      break;
    case 'Under Review':
      subject = `Your application for ${jobTitle} is now Under Review`;
      message = `<p>Hi ${candidateName},</p>
                 <p>Your application for <strong>${jobTitle}</strong> is currently being reviewed by our hiring directive led by ${recruiterName}.</p>
                 <p>We will keep you updated on your status.</p>`;
      break;
    default:
      subject = `Update on your application: ${jobTitle}`;
      message = `<p>Hi ${candidateName},</p>
                 <p>Your application status has been updated to: <strong>${newStatus}</strong>.</p>`;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 20px;">
      <h2 style="color: #2563eb; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px;">TalentBridge Pro</h2>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
      ${message}
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #94a3b8;">This is an automated notification from TalentBridge Career System.</p>
    </div>
  `;

  await sendEmail({
    email: candidateEmail,
    subject,
    html
  });
};

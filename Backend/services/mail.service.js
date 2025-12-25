const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h3>Email Verification</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${link}">${link}</a>
    `
  });
};

const sendResetPasswordEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
      <p>This link is valid for 10 minutes.</p>
    `,
  });
};

module.exports = { sendVerificationEmail,sendResetPasswordEmail };

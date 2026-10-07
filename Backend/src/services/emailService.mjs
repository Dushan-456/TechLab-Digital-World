import nodemailer from "nodemailer";
import "dotenv/config";

// Helper to instantiate the appropriate transporter
const getTransporter = () => {
   const user = process.env.EMAIL_USER;
   const pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASS;

   if (process.env.EMAIL_HOST && process.env.EMAIL_HOST !== "smtp.gmail.com") {
      return nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: Number(process.env.EMAIL_PORT) || 587,
         secure: process.env.EMAIL_SECURE === "true" || process.env.EMAIL_PORT === "465",
         auth: { user, pass },
      });
   }

   return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
   });
};

export const sendEmail = async (to, subject, text, html) => {
   const user = process.env.EMAIL_USER;
   const pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASS;

   if (!user || !pass || pass === "your_app_password" || user === "your_email@gmail.com") {
      console.warn("⚠️ [EmailService] Email skipped: EMAIL_USER or EMAIL_PASS not configured with valid credentials in .env.");
      return { skipped: true, message: "Email credentials not configured in environment" };
   }

   try {
      const transporter = getTransporter();
      const mailOptions = {
         from: process.env.EMAIL_FROM || user,
         to,
         subject,
         text,
         html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);
      return info;
   } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email.");
   }
};



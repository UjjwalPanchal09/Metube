import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Function to generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Function to send OTP via email
export const sendOTP = async (email) => {
  const otp = generateOTP();
  const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: "5m" });

  // Email Transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // ✅ Use 465 for SSL/TLS (avoiding STARTTLS issue)
    secure: true, // ✅ Must be true for SSL
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
  });

  // Email Options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Etube Verification Code ",
    text: `Dear User,
    Thank you for signing up with Etube!  

    Your verification code is: ${otp}. 

    This code is valid for 5 minutes. Please enter it in the app to complete your verification.  

    If you did not request this code, please ignore this email.  

Best regards,  
Etube Team  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, token };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Error sending OTP" };
  }
};

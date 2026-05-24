"use server";

import { ContactFormData } from "../lib/schema";
import nodemailer from "nodemailer";

export async function sendEmail(data: ContactFormData) {
  // 1. EXTRACT DATA HERE (This was missing)
  const { name, email, message } = data;

  // 2. DEBUG LOGS
  console.log("SMTP Config Check:", {
    user: process.env.SMTP_USER,
    hasPass: !!process.env.SMTP_PASS,
    host: process.env.SMTP_HOST
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email,
    });
    return { success: true };
  } catch (error) {
    console.error("SMTP Error:", error);
    return { success: false, error: "Failed to send email" };
  }
}
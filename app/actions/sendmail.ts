"use server";

import { ContactFormData } from "../lib/schema";
import nodemailer from "nodemailer";

export async function sendEmail(data: ContactFormData) {
  const { name, email, message } = data;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to send email" };
  }
}
"use server";

import { ContactFormData } from "../lib/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.resendApi!);

export async function sendEmail(data: ContactFormData) {
  const { name, email, message } = data;

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "seharajmal452@gmail.com",
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email,
    });
    return { success: true };
  } catch (error) {
    console.error("Resend Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
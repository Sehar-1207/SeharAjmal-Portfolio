// "use server";

// import { ContactFormData } from "../lib/schema";
// import { Resend } from "resend";

// const resend = new Resend(process.env.resendApi!);

// export async function sendEmail(data: ContactFormData) {
//   const { name, email, message } = data;

//   try {
//     await resend.emails.send({
//       from: "Portfolio Contact <onboarding@resend.dev>",
//       to: "seharajmal452@gmail.com",
//       subject: `New Message from ${name}`,
//       text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//       replyTo: email,
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Resend Error:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to send email",
//     };
//   }
// }

"use server";

import { ContactFormData } from "../lib/schema";
import { Resend } from "resend";

export async function sendEmail(data: ContactFormData) {
  const { name, email, message } = data;

  // 1. Guard against a missing environment variable string
  if (!process.env.resendApi) {
    console.error("Mailing Error: RESEND_API_KEY is not defined in .env.local");
    return { success: false, error: "Server missing API key configuration." };
  }

  try {
    // 2. Initialize inside the runtime execution context 
    const resend = new Resend(process.env.resendApi);

    const response = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "seharajmal452@gmail.com",
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email,
    });

    // 3. Catch structural issues returned by Resend
    if (response.error) {
      console.error("Resend API Refusal Response:", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Resend Pipeline Crash Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process mailing request",
    };
  }
}
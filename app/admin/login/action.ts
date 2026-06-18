"use server"

import dbConnect from "@/app/lib/mongodb" 
import mongoose, { Model } from "mongoose" // 👈 Imported Model for explicit type-casting
import { IAdminDocument } from "@/app/models/admin" // 👈 Make sure to export your interface from model.ts
import { cookies } from "next/headers"

export async function loginAdmin(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { success: false, error: "Please provide both email and password." }
    }

    // 1. Establish Mongoose connection
    await dbConnect()
    
    // 2. Safe Model Retrieval with Explicit Typing 
    // We explicitly cast it as a Model containing your IAdminDocument layout
    const AdminModel = (mongoose.models.Admin || (await import("@/app/models/admin")).Admin) as Model<IAdminDocument>;

    // 3. Find matching admin document (TypeScript will now recognize { email } perfectly!)
    const admin = await AdminModel.findOne({ email: email.toLowerCase() })

    if (!admin) {
      return { success: false, error: "Invalid email or security key connection." }
    }

    // 4. Password Verification
    const isPasswordValid = admin.password === password

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or security key connection." }
    }

    // 5. Assign standard secure session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, 
      path: "/",
    })

    return { success: true }
  } catch (error: any) {
    console.error("Login Server Action Error Trace:", error)
    return { success: false, error: error.message || "An expected cloud query exception occurred." }
  }
}
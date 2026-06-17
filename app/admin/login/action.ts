"use server"

import dbConnect from "../../lib/mongodb"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { Admin, IAdminDocument } from "../../lib/model" // 👈 Added explicit interface import
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function loginAdmin(formData: FormData) {
  try {
    const rawEmail = formData.get("email");
    const rawPassword = formData.get("password");

    // 1. Validate existence and type up front to clear TypeScript errors
    if (!rawEmail || !rawPassword || typeof rawEmail !== "string" || typeof rawPassword !== "string") {
      return { success: false, error: "Please fill in all fields." }
    }

    const email = rawEmail.toLowerCase().trim();
    const password = rawPassword.trim();

    await dbConnect()

    // 2. Strongly-type the query to resolve internal schema mismatches
    const admin = await Admin.findOne<IAdminDocument>({ email })
    if (!admin) {
      return { success: false, error: "Invalid email or password." } 
    }

    // 3. Compare the hashed password safely
    const isPasswordMatch = await bcrypt.compare(password, admin.password)
    if (!isPasswordMatch) {
      return { success: false, error: "Invalid email or password." }
    }

    // 4. Create Encrypted JWT Token
    const token = await new SignJWT({ adminId: admin._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(JWT_SECRET);

    const cookieStore = await cookies()
    
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  } catch (error: any) {
    console.error("Login Error:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}
import "server-only";

import mongoose, { Schema, model, models, Document } from "mongoose";

// ==========================================
// ADMIN MODEL
// ==========================================

export interface IAdmin {
  email: string;
  password?: string; 
  name?: string;
}

export interface IAdminDocument extends IAdmin, Document {
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,      // Prevents duplicate admin accounts
      lowercase: true,   // Forces lowercase to make logging in case-insensitive
      trim: true,
    },
    password: {
      type: String,
      required: true,    // This will store the securely HASHED password
    },
    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);


export const Admin = 
  models.Admin || model<IAdminDocument>("Admin", AdminSchema);  
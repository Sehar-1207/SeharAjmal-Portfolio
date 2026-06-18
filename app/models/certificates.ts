import "server-only";
import mongoose, { Schema, model, models, Document } from "mongoose";

// ==========================================
// CERTIFICATION MODEL
// ==========================================

export interface ICertification extends Document {
  title: string;
  issuer: string;
  issueDate?: string;
  description?: string; // 👈 1. Added description to the TypeScript Document interface
  image: {
    url: string;
    publicId: string;
  };
  credentialLink?: string;
}

const CertificationSchema = new Schema<ICertification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: String,
      default: "",
    },
    description: { // 👈 2. Added description block rules to your live MongoDB Collection
      type: String,
      default: "",
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    credentialLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Certification =
  models.Certification ||
  model<ICertification>("Certification", CertificationSchema);
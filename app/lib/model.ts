import "server-only";

import mongoose, { Schema, model, models, Document } from "mongoose";

// ==========================================
// PROJECT MODEL
// ==========================================

export interface IProject extends Document {
  title: string;
  description: string;
  category: "frontend" | "backend" | "automation" | "app-development";
  image: {
    url: string;
    publicId: string;
  };
  projectLink?: string;
  githubLink?: string;
  tags: string[];
  order: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["frontend", "backend", "automation", "app-development"],
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
    projectLink: {
      type: String,
      default: "",
    },
    githubLink: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// CERTIFICATION MODEL
// ==========================================

export interface ICertification extends Document {
  title: string;
  issuer: string;
  issueDate?: string;
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

// ==========================================
// RESUME MODEL
// ==========================================

export interface IResume extends Document {
  title: string;
  file: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
}

const ResumeSchema = new Schema<IResume>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// ==========================================
// ADMIN MODEL
// ==========================================

export interface IAdmin {
  email: string;
  password?: string; // Optional if we exclude it from queries for security
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
// ==========================================
// EXPORT MODELS
// ==========================================

export const Project =
  models.Project || model<IProject>("Project", ProjectSchema);

export const Certification =
  models.Certification ||
  model<ICertification>("Certification", CertificationSchema);

export const Resume =
  models.Resume || model<IResume>("Resume", ResumeSchema);

export const Admin = 
  models.Admin || model<IAdminDocument>("Admin", AdminSchema);  
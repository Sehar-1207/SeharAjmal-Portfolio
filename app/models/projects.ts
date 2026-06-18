import "server-only";

import mongoose, { Schema, model, models, Document, Model } from "mongoose";

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
      enum: ["frontend", "backend", "full-stack","automation", "app-development"],
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

export const ProjectModel: Model<IProject> =
  (models.Project as Model<IProject>) || model<IProject>("Project", ProjectSchema);
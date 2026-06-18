import "server-only";

import mongoose, { Schema, model, models, Document, Model } from "mongoose";

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
  { timestamps: true }
);

export const ResumeModel: Model<IResume> =
  (models.Resume as Model<IResume>) || model<IResume>("Resume", ResumeSchema);
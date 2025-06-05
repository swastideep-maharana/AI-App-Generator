import mongoose, { Schema, Document } from "mongoose";

export interface GeneratedApp extends Document {
  userId: string;
  prompt: string;
  appType: string;
  framework: string;
  result: string;
  createdAt: Date;
}

const GeneratedAppSchema = new Schema<GeneratedApp>(
  {
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    appType: { type: String, required: true },
    framework: { type: String, required: true },
    result: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.GeneratedApp ||
  mongoose.model("GeneratedApp", GeneratedAppSchema);

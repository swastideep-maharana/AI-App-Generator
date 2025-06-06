import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGeneratedApp extends Document {
  userId: string;
  prompt: string;
  appType: string;
  framework: string;
  result: string;
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedAppSchema = new Schema<IGeneratedApp>(
  {
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    appType: { type: String, required: true },
    framework: { type: String, required: true },
    result: { type: String, required: true },
  },
  { timestamps: true }
);

const GeneratedApp: Model<IGeneratedApp> =
  mongoose.models.GeneratedApp ||
  mongoose.model<IGeneratedApp>("GeneratedApp", GeneratedAppSchema);

export default GeneratedApp;

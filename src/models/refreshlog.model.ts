import { Schema, model, Document } from "mongoose";

export interface IRefreshLog extends Document {
  timestamp: Date;
  status: "success" | "failed";
  message: string;
}

// Data Refresh Log Schema
const RefreshLogSchema = new Schema<IRefreshLog>(
  {
    timestamp: { type: Date, default: Date.now },
    status: { type: String, required: true, enum: ["success", "failed"] },
    message: { type: String },
  },
  { timestamps: true }
);

export const RefreshLog = model<IRefreshLog>("RefreshLog", RefreshLogSchema);

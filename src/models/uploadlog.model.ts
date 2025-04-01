import mongoose from "mongoose";

const uploadLogSchema = new mongoose.Schema(
  {
    filePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { collection: "upload_logs" }
);

export default mongoose.model("UploadLog", uploadLogSchema);

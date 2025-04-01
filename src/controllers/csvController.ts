import { Request, Response } from "express";
import { csvQueue } from "../queues/csvQueue";
import UploadLog from "../models/uploadlog.model";
import { refreshQueue } from "../queues/refreshQueue";

export const uploadCsv = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    await UploadLog.create({ filePath });

    await csvQueue.add("process-csv", { filePath });

    res.json({ message: "File uploaded. Processing in the background." });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
  }
};

export const refreshData = async (req: Request, res: Response) => {
  try {
    const latestUpload = await UploadLog.findOne().sort({ uploadedAt: -1 });
    const latestFile = latestUpload ? latestUpload.filePath : null;
    if (!latestFile) {
      return res.status(404).json({ message: "No recent CSV file found." });
    }

    await refreshQueue.add("refresh-data", { filePath: latestFile });

    res.json({ message: "Data refresh started using the last uploaded CSV." });
  } catch (error) {
    res.status(500).json({ message: "Error triggering refresh", error });
  }
}
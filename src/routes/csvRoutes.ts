import express from "express";
import multer from "multer";
import { uploadCsv, refreshData } from "../controllers/csvController";

const router: any = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadCsv);

router.post("/refresh", refreshData);

export default router;

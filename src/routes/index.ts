import express from "express";
import csvRoutes from "./csvRoutes";
import salesAnalyticsRoutes from "./salesAnalyticsRoutes";
import { getRequestData } from "../middlewares/getRequestData";

const router = express.Router();

router.use("/csv", csvRoutes);
router.use("/sales-analytics", getRequestData, salesAnalyticsRoutes);

export default router;
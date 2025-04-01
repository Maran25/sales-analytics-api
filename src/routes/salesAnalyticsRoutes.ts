import express from "express";
import {
  getTopNProductsByCategory,
  getTopNProductsByRegion,
  getTopNProductsOverall,
} from "../controllers/salesAnalyticsController";
import validate from "../middlewares/validate";
import {
  categoryAnalyticsQuerySchema,
  overallAnalyticsQuerySchema,
  regionAnalyticsQuerySchema,
} from "../validators/salesAnalyticsValidator";

const router = express.Router();

router.get(
  "/top-products/overall",
  validate(overallAnalyticsQuerySchema),
  getTopNProductsOverall
);

router.get(
  "/top-products/category",
  validate(categoryAnalyticsQuerySchema),
  getTopNProductsByCategory
);

router.get(
  "/top-products/region",
  validate(regionAnalyticsQuerySchema),
  getTopNProductsByRegion
);

export default router;

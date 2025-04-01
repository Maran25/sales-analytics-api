import { Request, Response } from "express";
import SalesAnalyticsService from "../services/salesAnalyticsService";

  export const getTopNProductsOverall = async (req: Request, res: Response) => {
    try {
      const { N, startDate, endDate } = res.locals.reqdata;
      console.log('data**', res.locals.reqdata)
      const data = await SalesAnalyticsService.getTopNProductsOverall(
        Number(N),
        String(startDate),
        String(endDate)
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching top products", error });
    }
  }

  export const getTopNProductsByCategory = async (req: Request, res: Response) => {
    try {
      const { N, category, startDate, endDate } = res.locals.reqdata;
      const data = await SalesAnalyticsService.getTopNProductsByCategory(
        Number(N),
        String(category),
        String(startDate),
        String(endDate)
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category products", error });
    }
  }

  export const getTopNProductsByRegion = async (req: Request, res: Response) => {
    try {
      const { N, region, startDate, endDate } = res.locals.reqdata;
      const data = await SalesAnalyticsService.getTopNProductsByRegion(
        Number(N),
        String(region),
        String(startDate),
        String(endDate)
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching region products", error });
    }
  }

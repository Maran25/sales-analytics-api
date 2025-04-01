import { Order } from "../models/order.model";

class SalesAnalyticsService {
  private static instance: SalesAnalyticsService;

  private constructor() {}

  public static getInstance(): SalesAnalyticsService {
    if (!SalesAnalyticsService.instance) {
      SalesAnalyticsService.instance = new SalesAnalyticsService();
    }
    return SalesAnalyticsService.instance;
  }

  async getTopNProductsOverall(N: number, startDate: string, endDate: string) {
    return await Order.aggregate([
      { 
        $match: { 
          dateOfSale: { $gte: new Date(startDate), $lte: new Date(endDate) } 
        }
      },
      { 
        $group: { 
          _id: "$productId", 
          totalQuantitySold: { $sum: "$quantitySold" } 
        } 
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: N },
      { 
        $lookup: { 
          from: "products", 
          localField: "_id",
          foreignField: "id", 
          as: "productDetails" 
        } 
      },
      { $unwind: "$productDetails" },
      { 
        $project: { 
          _id: 0, 
          productId: "$_id", 
          productName: "$productDetails.name", 
          category: "$productDetails.category", 
          totalQuantitySold: 1 
        } 
      }
    ]);
  }
  

  async getTopNProductsByCategory(N: number, category: string, startDate: string, endDate: string) {
    return await Order.aggregate([
      { 
        $match: { 
          dateOfSale: { $gte: new Date(startDate), $lte: new Date(endDate) } 
        }
      },
      { 
        $group: { 
          _id: "$productId", 
          totalQuantitySold: { $sum: "$quantitySold" } 
        } 
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: N },
      { 
        $lookup: { 
          from: "products", 
          localField: "_id",  
          foreignField: "id", 
          as: "productDetails" 
        } 
      },
      { $unwind: "$productDetails" },
      { $match: { "productDetails.category": category } },
      { 
        $project: { 
          _id: 0, 
          productId: "$_id", 
          productName: "$productDetails.name", 
          category: "$productDetails.category", 
          totalQuantitySold: 1 
        } 
      }
    ]);
  }
  
  

  async getTopNProductsByRegion(N: number, region: string, startDate: string, endDate: string) {
    return await Order.aggregate([
      {
        $match: {
          dateOfSale: { $gte: new Date(startDate), $lte: new Date(endDate) },
          region: region
        }
      },
      {
        $group: {
          _id: "$productId",
          totalQuantitySold: { $sum: "$quantitySold" }
        }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: N },
      {
        $lookup: {
          from: "products",
          localField: "_id",       
          foreignField: "id",      
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.name",
          category: "$productDetails.category", 
          totalQuantitySold: 1
        }
      }
    ]);
  }  
}

export default SalesAnalyticsService.getInstance();

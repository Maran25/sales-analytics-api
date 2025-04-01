import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import { closeDatabase, connectToDatabase } from "../src/config/db";
import { closeRedis } from "../src/config/redis";
import { seedDatabase } from "./seeder";

describe("Sales Analytics - Top Products API", () => {
  beforeAll(async () => {
    try {
      console.log("Setting up test environment...");
      process.env.NODE_ENV = "test";
      await connectToDatabase();
      await seedDatabase();
      console.log("BeforeAll setup complete");
    } catch (error) {
      console.error("Error setting up test environment:", error);
    }
  });

  afterAll(async () => {
    try {
      console.log("Tearing down test environment...");
      await closeDatabase();
      await closeRedis();
      console.log("AfterAll teardown complete");
    } catch (error) {
      console.error("Error tearing down test environment:", error);
    }
  });

  it("Overall - should return top N products overall", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/overall")
      .query({ N: 2, startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(2);
      expect(response.body[0]).toHaveProperty("productId");
    expect(response.body[0]).toHaveProperty("productName");
    expect(response.body[0]).toHaveProperty("totalQuantitySold");
  });
  
  it("Category - should return top N products for a given category", async () => {
    const response = await request(app)
    .get("/api/sales-analytics/top-products/category")
    .query({ N: 2, category: "Electronics", startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(2);
    expect(
      response.body.every((p: any) => p.category === "Electronics")
    ).toBe(true);
    expect(response.body[0]).toHaveProperty("productId");
    expect(response.body[0]).toHaveProperty("productName");
    expect(response.body[0]).toHaveProperty("totalQuantitySold");
  });

  it("Region - should return top N products for a given region", async () => {
    const response = await request(app)
    .get("/api/sales-analytics/top-products/region")
    .query({ N: 2, region: "North America", startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(2);
    expect(response.body[0]).toHaveProperty("productId");
    expect(response.body[0]).toHaveProperty("productName");
    expect(response.body[0]).toHaveProperty("totalQuantitySold");
  });

  it("Category - should return 400 for missing category", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/category")
      .query({ N: 2, startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.message).toEqual("Validation error");
    expect(response.body.errors).toContain('"category" is required');
  });

  it("Region - should return 400 for missing region", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/region")
      .query({ N: 2, startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.message).toEqual("Validation error");
    expect(response.body.errors).toContain('"region" is required');
  });

  it("Overall - should return 400 for invalid N", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/overall")
      .query({ N: "invalid", startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.message).toEqual("Validation error");
    expect(response.body.errors).toContain('"N" must be a number');
  });

  it("Category - should return 400 for invalid N", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/category")
      .query({ N: "invalid", category: "Electronics", startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.message).toEqual("Validation error");
    expect(response.body.errors).toContain('"N" must be a number');
  });

  it("Region - should return 400 for missing N", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/region")
      .query({ region: "North America", startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.message).toEqual("Validation error");
    expect(response.body.errors).toContain('"N" is required');
  });

  it("Overall - should return empty array if no data", async () => {
    await mongoose.connection.dropDatabase();

    const response = await request(app)
      .get("/api/sales-analytics/top-products/overall")
      .query({ N: 2, startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("Category - should return empty array for non-existing category", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/category")
      .query({ N: 2, category: "NonExistentCategory", startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("Region - should return empty array for non-existing region", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/region")
      .query({ N: 2, region: "NonExistentRegion", startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("Overall - should return correct data with max N", async () => {
    const response = await request(app)
      .get("/api/sales-analytics/top-products/overall")
      .query({ N: 1000, startDate: new Date('12-01-2020'), endDate: new Date('12-05-2025') });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(1000);
  });
});

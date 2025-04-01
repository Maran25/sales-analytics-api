import { closeDatabase, connectToDatabase } from "../src/config/db";
import { closeRedis } from "../src/config/redis";
import { seedDatabase } from "./seeder";

beforeAll(async () => {
  try {
    await connectToDatabase();

    await seedDatabase();
  } catch (error) {
    console.error("Error setting up test environment:", error);
  }
});

afterAll(async () => {
  try {
    await closeDatabase();

    await closeRedis();
  } catch (error) {
    console.error("Error tearing down test environment:", error);
  }
});

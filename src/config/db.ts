import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer | null = null;

export const connectToDatabase = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV === "test") {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log("Connected to in-memory MongoDB for testing");
    } else {
      const mongoUrl = process.env.MONGO_URL!;
      await mongoose.connect(mongoUrl);
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed");

    if (mongoServer) {
      await mongoServer.stop();
      console.log("In-memory MongoDB stopped");
    }
  } catch (error) {
    console.error("Error closing the database connection:", error);
  }
};

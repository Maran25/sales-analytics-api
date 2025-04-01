import redis from "../config/redis";
import { Queue } from "bullmq";

const jobQueue = new Queue("data-refresh", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});

export const jobLoader = async () => {
  try {
    await redis.ping();
    console.log("Redis is ready for job processing.");

    // to check if it's working
    await jobQueue.add("refreshData", {});
    console.log("Job queue initialized.");
  } catch (error) {
    console.error("Failed to initialize job queue:", error);
    process.exit(1);
  }
};

export default jobQueue;

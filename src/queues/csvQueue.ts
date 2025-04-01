import { Queue } from "bullmq";
import redis from "../config/redis"; 

export const csvQueue = new Queue("csv-processing", {
  connection: redis,
});

import { Queue } from "bullmq";
import redis from "../config/redis";

export const refreshQueue = new Queue("refresh-data", { connection: redis });

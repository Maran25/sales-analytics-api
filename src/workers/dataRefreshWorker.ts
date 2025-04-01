import { Worker } from "bullmq";
import redis from "../config/redis";
import CsvUploadService from "../services/csvUploadService";

const refreshWorker = new Worker(
  "refresh-data",
  async (job) => {
    console.log(`Refreshing data using CSV file: ${job.data.filePath}`);
    await CsvUploadService.processCsvFile(job.data.filePath);
    console.log("Data refresh completed.");
  },
  { connection: redis }
);

refreshWorker.on("completed", (job) => {
  console.log(`Refresh job ${job.id} completed successfully.`);
});

refreshWorker.on("failed", (job, err) => {
  console.error(`Refresh job ${job?.id} failed:`, err);
});
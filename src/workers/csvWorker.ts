import { Worker } from "bullmq";
import redis from "../config/redis";
import CsvUploadService from "../services/csvUploadService";

const csvWorker = new Worker(
  "csv-processing",
  async (job) => {
    console.log(`Processing CSV file: ${job.data.filePath}`);
    await CsvUploadService.processCsvFile(job.data.filePath);
    console.log("CSV processing completed.");
  },
  { connection: redis }
);

csvWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

csvWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

import Redis from "ioredis";

const redis = new Redis({ host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 });

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err: Error) => {
  console.error("Error connecting to Redis: ", err);
});

export const closeRedis = async () => {
  await redis.flushdb();
  await redis.quit();
  console.log("Redis cache cleared and connection closed.");
};

export default redis;

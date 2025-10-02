import { createClient } from "redis";
import { RedisMessages } from "../utils/Messages";
import logger from "../utils/Logger";

const REDIS_URL = process.env.REDIS_URL 

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => logger.error(RedisMessages.ERROR(err)));
redisClient.on("connect", () => logger.info(RedisMessages.CONNECTED));

 export async function connectRedis() {
  await redisClient.connect();
  
}

connectRedis(); 

import { createClient } from "redis";
import { RedisMessages } from "../utils/Messages";

const REDIS_URL = process.env.REDIS_URL 

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => console.error(RedisMessages.ERROR(err)));
redisClient.on("connect", () => console.log(RedisMessages.CONNECTED));

 export async function connectRedis() {
  await redisClient.connect();
  
}

connectRedis(); 

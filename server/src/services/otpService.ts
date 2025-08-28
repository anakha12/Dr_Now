
import { redisClient } from "../config/redis";

export const setOTP = async (key: string, otp: string, expireSeconds=300) => {
  await redisClient.setEx(key, expireSeconds, otp);
};

export const getOTP = async (key: string) => {
  return await redisClient.get(key);
};


export const deleteOTP = async (key: string) => {
  await redisClient.del(key);
};
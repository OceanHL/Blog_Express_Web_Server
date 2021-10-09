import redis from "redis";
import { REDIS_CONFIG } from "../config/db";

// 1. 创建客户端
const redisClient = redis.createClient(REDIS_CONFIG);
redisClient.on("error", err => console.error(err));

export default redisClient;
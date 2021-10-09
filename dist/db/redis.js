"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const db_1 = require("../config/db");
// 1. 创建客户端
const redisClient = redis_1.default.createClient(db_1.REDIS_CONFIG);
redisClient.on("error", err => console.error(err));
exports.default = redisClient;

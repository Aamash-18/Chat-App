import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const ONLINE_USERS_KEY = "presence:online-users";

export const getPresenceKey = (userId) => `presence:user:${userId}`;

export const initializeRedis = async (io) => {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not configured");
  }

  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on("error", (error) => {
    console.error("Redis publisher error:", error.message);
  });
  subClient.on("error", (error) => {
    console.error("Redis subscriber error:", error.message);
  });

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  console.log("REDIS CONNECTED...");

  return pubClient;
};

export const broadcastOnlineUsers = async (io, redisClient) => {
  const onlineUsers = await redisClient.sMembers(ONLINE_USERS_KEY);
  io.emit("getOnlineUsers", onlineUsers);
};

export const markUserOnline = async (redisClient, userId, socketId) => {
  const socketCount = await redisClient.sAdd(getPresenceKey(userId), socketId);

  if (socketCount === 1) {
    await redisClient.sAdd(ONLINE_USERS_KEY, userId);
    return true;
  }

  return false;
};

export const markUserOffline = async (redisClient, userId, socketId) => {
  await redisClient.sRem(getPresenceKey(userId), socketId);
  const remainingSockets = await redisClient.sCard(getPresenceKey(userId));

  if (remainingSockets === 0) {
    await redisClient.del(getPresenceKey(userId));
    await redisClient.sRem(ONLINE_USERS_KEY, userId);
    return true;
  }

  return false;
};

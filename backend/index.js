dotenv.config();
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";
import groupRouter from "./routes/groupRouter.js";
import groupMessageRouter from "./routes/groupMessageRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import {
  broadcastOnlineUsers,
  initializeRedis,
  markUserOffline,
  markUserOnline,
} from "./config/redis.js";


const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
  ].filter(Boolean);

  if (allowedOrigins.includes(origin)) return true;
  if (origin.includes(".vercel.app")) return true;
  if (origin.includes(".onrender.com")) return true;

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
const server = http.createServer(app);

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// Keep old local uploads readable while new files use Cloudinary.
app.use("/uploads", express.static("uploads"));
app.use(cors(corsOptions));

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/group", groupRouter);
app.use("/api/v1/group-message", groupMessageRouter);

// socket.io
export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  },
});

let redisClient;

io.on("connection", (socket) => {
  console.log("New Device Connected:", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    socket.join(`user:${userId}`);
    markUserOnline(redisClient, userId, socket.id)
      .then(() => broadcastOnlineUsers(io, redisClient))
      .catch((error) => console.error("Redis presence error:", error.message));
  }

   // ✅ JOIN GROUP ROOM
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
  });

  // ✅ LEAVE GROUP ROOM (optional)
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
  });
  
  socket.on("disconnect", () => {
    console.log(`User Disconected ${socket.id}`);

    if (userId) {
      markUserOffline(redisClient, userId, socket.id)
        .then(() => broadcastOnlineUsers(io, redisClient))
        .catch((error) => console.error("Redis presence error:", error.message));
    }
  });
});

const startServer = async () => {
  try {
    redisClient = await initializeRedis(io);
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running at PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};

startServer();


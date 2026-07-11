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


dotenv.config();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
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
app.use("/uploads", express.static("uploads"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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

const userSocketMap={};

export const getReceiverSocketId=(userId)=>{
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("New Device Connected:", socket.id);
  const userId=socket.handshake.query.userId;
  if(userId!== undefined){
      userSocketMap[userId]=socket.id;
  }

   // ✅ JOIN GROUP ROOM
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
  });

  // ✅ LEAVE GROUP ROOM (optional)
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
  });
  
  io.emit('getOnlineUsers',Object.keys(userSocketMap));
  
  socket.on('disconnect',()=>{
    
    console.log(`User Disconected ${socket.id}`);
    if(userId){
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap));
  })
});

// ✅ ONLY THIS should listen
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
  });
});


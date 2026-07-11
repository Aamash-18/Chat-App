import express from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ✅ SEND MESSAGE (text + file)
router
  .route("/send/:id")
  .post(isAuthenticated, upload.single("file"), sendMessage);

// ✅ GET MESSAGES
router
  .route("/:id")
  .get(isAuthenticated, getMessage);

export default router;
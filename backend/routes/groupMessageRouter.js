import express from "express";
import { sendGroupMessage,getGroupMessages } from "../controllers/groupMessageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/send",
  isAuthenticated,
  upload.single("file"), // 🔥 ye add kar
  sendGroupMessage
);
router.get("/:groupId", isAuthenticated, getGroupMessages);





export default router;


import { conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { io } from "../index.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;
    const { message } = req.body;

    // ✅ FILE HANDLE
    let fileUrl = "";
    let fileType = "";

    if (req.file) {
      const uploadedFile = await uploadToCloudinary(
        req.file.buffer,
      );
      fileUrl = uploadedFile.secure_url;
      fileType = req.file.mimetype;
    }

    // 🔍 find conversation
    let getConversation = await conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    // 🆕 create if not exists
    if (!getConversation) {
      getConversation = await conversation.create({
        participants: [senderId, recieverId],
      });
    }

    // 💬 create message (text + file)
    const newMessage = await Message.create({
      senderId,
      recieverId,
      message: message || "", // ✅ safe
      fileUrl,
      fileType,
    });

    // 📥 push message
    if (newMessage) {
      getConversation.messages.push(newMessage._id);
    }

    await getConversation.save();

    // ⚡ SOCKET
    io.to(`user:${recieverId}`).emit("newMessage", newMessage);

    return res.status(200).json({ newMessage });

  } catch (err) {
    console.log("Error in sendMessage:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📩 GET MESSAGES
export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;

    const getConversation = await conversation
      .findOne({
        participants: { $all: [senderId, recieverId] },
      })
      .populate("messages");

    return res.status(200).json(getConversation?.messages);

  } catch (err) {
    console.log("Error in getMessage:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
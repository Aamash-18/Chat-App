import { GroupMessage } from "../models/groupMessageModel.js";
import { io } from "../index.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export const sendGroupMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const { groupId, message } = req.body;

    // ✅ FILE HANDLE (NEW)
    let fileUrl = "";
    let fileType = "";

    if (req.file) {
      const uploadedFile = await uploadToCloudinary(
        req.file.buffer,
      );
      fileUrl = uploadedFile.secure_url;
      fileType = req.file.mimetype;
    }

    // ❗ allow file-only message also
    if (!groupId || (!message && !req.file)) {
      return res.status(400).json({
        message: "GroupId and message/file required"
      });
    }

    const newMessage = await GroupMessage.create({
      groupId,
      senderId,
      message: message || "", // ✅ safe
      fileUrl,
      fileType
    });

    // populate sender
    await newMessage.populate("senderId", "fullname profilePhoto");

    // socket emit
    io.to(groupId).emit("newGroupMessage", newMessage);

    return res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error in sendGroupMessage:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({
        message: "GroupId is required"
      });
    }

    const messages = await GroupMessage.find({ groupId })
      .populate("senderId", "fullname username profilePhoto")
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);

  } catch (error) {
    console.log("Error in getGroupMessages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
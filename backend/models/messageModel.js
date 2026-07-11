import mongoose from "mongoose";

const messageModel = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "", // ✅ instead of required
    },
    fileUrl: String,
    fileType: String,
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageModel);
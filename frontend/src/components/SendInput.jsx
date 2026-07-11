import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { buildUrl } from "../config/api";

const SendInput = () => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();
  const fileRef = useRef();

  const { selectedUser } = useSelector((store) => store.user);
  const { selectedGroup } = useSelector((store) => store.group);
  const { messages } = useSelector((store) => store.messages);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedUser, selectedGroup]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!message?.trim() && !file) return;

    try {
      setLoading(true);
      let res;

      // ✅ USER CHAT
      if (selectedUser) {
        const formData = new FormData();
        formData.append("message", message || "");
        if (file) formData.append("file", file);

        res = await axios.post(
          buildUrl(`/api/v1/message/send/${selectedUser._id}`),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );
      }

      // ✅ GROUP CHAT
      else if (selectedGroup) {
        const formData = new FormData();
        formData.append("groupId", selectedGroup._id);
        formData.append("message", message || "");
        if (file) formData.append("file", file);

        res = await axios.post(
          buildUrl("/api/v1/group-message/send"),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );
      }

      // ✅ SAFE DISPATCH
      if (res?.data?.newMessage) {
        dispatch(setMessages([...(messages || []), res.data.newMessage]));
      }

      // ✅ RESET
      setMessage("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.log("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="px-4 my-3">
      <div className="w-full relative flex items-center">
        {/* 📎 FILE ICON */}
        <label className="absolute left-3 cursor-pointer text-gray-400 text-lg">
          📎
          <input
            ref={fileRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        {/* 💬 TEXT INPUT */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message"
          className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 text-white border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white"
        />

        {/* 🚀 SEND BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 text-white disabled:opacity-50"
        >
          <IoSend />
        </button>
      </div>

      {/* 📁 selected file name */}
      {file && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 ml-2">
          <span>{file.name}</span>
          <button onClick={() => setFile(null)}>❌</button>
        </div>
      )}
    </form>
  );
};

export default SendInput;

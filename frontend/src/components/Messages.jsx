import React from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessages";
import useGetGroupMessages from "../hooks/useGetGroupMessages";

const Messages = () => {
  useGetMessages();
  useGetRealTimeMessage();
  useGetGroupMessages();
  const { messages } = useSelector((store) => store.messages);
  if (!messages) return;
  return (
    <div className=" px-4 flex-1 overflow-auto  w-full">
      {messages?.map((message) => {
        return <Message key={message._id} message={message} />;
      })}
    </div>
  );
};

export default Messages;

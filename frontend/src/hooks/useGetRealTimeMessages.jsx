import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ 1-1 message
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });

    // ✅ GROUP message
    socket?.on("newGroupMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("newGroupMessage");
    };
  }, [messages, socket, dispatch]);
};

export default useGetRealTimeMessage;

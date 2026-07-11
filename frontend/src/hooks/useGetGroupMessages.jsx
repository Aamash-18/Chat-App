import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { buildUrl } from "../config/api";

const useGetGroupMessages = () => {
  const dispatch = useDispatch();
  const { selectedGroup } = useSelector((store) => store.group);

  useEffect(() => {
    if (!selectedGroup?._id) return; // ✅ IMPORTANT

    const fetchGroupMessages = async () => {
      try {
        const res = await axios.get(
          buildUrl(`/api/v1/group-message/${selectedGroup._id}`),
          { withCredentials: true },
        );

        dispatch(setMessages(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupMessages();
  }, [selectedGroup, dispatch]);
};

export default useGetGroupMessages;

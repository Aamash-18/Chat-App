import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUser } from "../redux/userSlice";
import { buildUrl } from "../config/api";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((store) => store.user);

  useEffect(() => {
    if (!authUser) return;

    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(buildUrl("/api/v1/user/"), {
          withCredentials: true,
        });

        dispatch(setOtherUser(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    fetchOtherUsers();
  }, [authUser, dispatch]);
};

export default useGetOtherUsers;

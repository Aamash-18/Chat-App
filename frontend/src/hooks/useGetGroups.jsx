import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setGroups } from "../redux/groupSlice";
import { buildUrl } from "../config/api";

const useGetGroups = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(buildUrl("/api/v1/group/my-groups"), {
          withCredentials: true,
        });

        dispatch(setGroups(res.data));
      } catch (error) {
        console.log("Error fetching groups", error);
      }
    };

    fetchGroups();
  }, [dispatch]);
};

export default useGetGroups;

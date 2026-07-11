import React, { useState } from "react";
// import { RiSearchLine } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAllUser, setOtherUser } from "../redux/userSlice";
import { clearAllMessages } from "../redux/messageSlice";
import { clearGroups } from "../redux/groupSlice";
import OtherUsers from "./OtherUsers";
import Groups from "./Groups";
import { buildUrl } from "../config/api";

const SideBar = ({ closeSidebar, setOpen }) => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(buildUrl("/api/v1/user/logout"));
      navigate("/login");
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    }
    dispatch(clearAllUser());
    dispatch(clearAllMessages());
    dispatch(clearGroups());
  };

  return (
    <div className="flex flex-col h-screen md:h-[80vh] border-slate-500 p-4">
      <form action="" className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="input rounded-md focus:outline-none focus:ring-0 "
          type="text"
          placeholder="search friend"
        />
        {/* <button
          className="btn  bg-white text-black rounded-lg  hover:bg-zinc-700 hover:text-white  duration-300"
          type="submit"
        >
          <RiSearchLine className="w-6 h-6" />
        </button> */}
      </form>
      <div className="divider px-3"> </div>
      <div className="flex-1 overflow-y-auto">
        <Groups search={search} closeSidebar={closeSidebar} />
        <OtherUsers search={search} closeSidebar={closeSidebar} />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          onClick={logoutHandler}
          className="btn rounded-lg bg-white text-black  hover:bg-zinc-700 hover:text-white mt-4"
        >
          Logout
        </button>
        <button
          onClick={() => setOpen(true)}
          className="btn rounded-lg bg-white text-black  hover:bg-zinc-700 hover:text-white mt-4"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default SideBar;

import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedGroup } from "../redux/groupSlice";
import { setSelectedUser } from "../redux/userSlice";

const Group = ({ group, closeSidebar }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(setSelectedGroup(group));
    dispatch(setSelectedUser(null));
    closeSidebar?.(); // ✅ ADD THIS
  };
  return (
    <div
      onClick={handleClick}
      className={`flex gap-4 items-center hover:bg-blue-950 rounded-lg p-2 pr-15`}
    >
      <div className="w-10 rounded-full">
        <img src={group?.groupPhoto} alt="groupPhoto" />
      </div>
      <div className="p-2 rounded-lg text-white cursor-pointer">
        {group.name}
      </div>
    </div>
  );
};

export default Group;

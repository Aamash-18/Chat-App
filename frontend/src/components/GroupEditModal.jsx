import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import {
  updateGroupName,
  removeMember,
  addMemberToGroup,
} from "../redux/groupSlice";
import { buildUrl } from "../config/api";

const GroupEditModal = ({ open, setOpen }) => {
  const { otherUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { selectedGroup } = useSelector((state) => state.group);

  const [groupName, setGroupName] = useState("");
  const filteredUsers = otherUser
    ?.filter((user) => user._id !== selectedGroup?.admin?._id)
    ?.filter((user) =>
      user.fullname.toLowerCase().includes(search.toLowerCase()),
    )
    ?.filter(
      (user) => !selectedGroup?.members?.some((m) => m._id === user._id),
    );
  // ✅ jab group change ho
  useEffect(() => {
    if (selectedGroup) {
      setGroupName(selectedGroup.name);
    }
  }, [selectedGroup]);

  if (!open) return null;

  // 🔥 RENAME HANDLER
  const renameHandler = async () => {
    if (!groupName.trim()) {
      return toast.error("Group name required");
    }

    try {
      const res = await axios.put(
        buildUrl("/api/v1/group/rename"),
        {
          groupId: selectedGroup._id,
          name: groupName,
        },
        { withCredentials: true },
      );

      // ✅ redux update
      dispatch(
        updateGroupName({
          groupId: selectedGroup._id,
          name: groupName,
        }),
      );

      toast.success("Group renamed");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Rename failed");
    }
  };
  //Remove Handler
  const removeMemberHandler = async (userId) => {
    try {
      await axios.put(
        buildUrl("/api/v1/group/remove-member"),
        {
          groupId: selectedGroup._id,
          userId,
        },
        { withCredentials: true },
      );

      dispatch(
        removeMember({
          groupId: selectedGroup._id,
          userId,
        }),
      );

      toast.success("Member removed");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to remove member");
    }
  };
  //Add Handler
  const addMemberHandler = async (user) => {
    try {
      const res = await axios.post(
        buildUrl("/api/v1/group/add-member"),
        {
          groupId: selectedGroup._id,
          userId: user._id,
        },
        { withCredentials: true },
      );

      dispatch(
        addMemberToGroup({
          groupId: selectedGroup._id,
          user,
        }),
      );

      toast.success("Member added");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to add member");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 w-[400px] p-5 rounded-xl flex flex-col gap-4">
        <h2 className="text-white text-xl font-semibold text-center">
          Edit Group
        </h2>

        {/* Rename */}
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-transparent border border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />

        {/* Members (UI only for now) */}
        <div className="max-h-40 overflow-y-auto">
          {selectedGroup?.members?.map((member) => (
            <div
              key={member._id}
              className="flex justify-between items-center p-2 text-white"
            >
              <span>{member.fullname}</span>
              <button
                onClick={() => removeMemberHandler(member._id)}
                className="text-red-400"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        {/* //Add member  */}

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search users to add"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-transparent border border-gray-400 text-white placeholder-gray-400 focus:outline-none"
        />

        {/* USERS LIST */}
        <div className="max-h-32 overflow-y-auto">
          {filteredUsers?.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center p-2 text-white"
            >
              <span>{user.fullname}</span>

              <button
                onClick={() => addMemberHandler(user)}
                className="bg-white text-black px-2 py-1 rounded"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setOpen(false)}
            className="bg-white text-black px-3 py-1 rounded"
          >
            Close
          </button>

          <button
            onClick={renameHandler}
            className="bg-white text-black px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupEditModal;

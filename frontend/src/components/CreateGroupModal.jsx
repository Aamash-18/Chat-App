import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addGroup } from "../redux/groupSlice";
import { buildUrl } from "../config/api";

const CreateGroupModal = ({ open, setOpen }) => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { otherUser, authUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  if (!open) return null;

  // 🔍 Filter users
  const filteredUsers = otherUser
    ?.filter((user) => user._id !== authUser._id)
    ?.filter((user) =>
      user.fullname.toLowerCase().includes(search.toLowerCase()),
    );

  // ➕ Add user
  const addUser = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) return;
    setSelectedUsers([...selectedUsers, user]);
  };

  // ❌ Remove user
  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
  };

  // 🚀 Create group
  const createGroupHandler = async () => {
    if (!groupName.trim()) {
      return toast.error("Group name required");
    }

    try {
      const res = await axios.post(
        buildUrl("/api/v1/group/create"),
        {
          name: groupName,
          members: selectedUsers.map((u) => u._id),
        },
        { withCredentials: true },
      );
      dispatch(addGroup(res.data));
      toast.success("Group created");
      setOpen(false);
      setGroupName("");
      setSelectedUsers([]);
      setSearch("");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Error creating group");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      {/* Modal */}
      <div className=" bg-gray-800 w-[350px] p-5 rounded-xl shadow-lg flex flex-col gap-4">
        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-white">
          Create Group
        </h2>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 text-black bg-white focus:outline-none"
        />

        {/* Search Users */}
        <input
          type="text"
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 text-black bg-white focus:outline-none"
        />

        {/* Selected Users */}
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-black text-white px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              {user.fullname}
              <button
                onClick={() => removeUser(user._id)}
                className="text-red-400 font-bold ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Users List */}
        <div className="max-h-32 overflow-y-auto">
          {filteredUsers?.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center p-2 border-b border-gray-300 text-white"
            >
              <div className="flex gap-1.5 justify-center items-center">
                <div className="w-10 rounded-full">
                  <img src={user?.profilePhoto} alt="userProfile" />
                </div>
                <span className="font-medium">{user.fullname}</span>
              </div>

              <button
                onClick={() => addUser(user)}
                className="text-sm bg-white text-black px-3 py-1 rounded hover:bg-zinc-700"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-2">
          <button
            onClick={() => setOpen(false)}
            className="btn bg-white text-black rounded-lg border border-black hover:bg-zinc-700 hover:text-white duration-300"
          >
            Close
          </button>

          <button
            onClick={createGroupHandler}
            className="btn bg-white text-black rounded-lg border border-black hover:bg-zinc-700 hover:text-white duration-300"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

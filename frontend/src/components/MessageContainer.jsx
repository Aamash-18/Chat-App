import React, { useEffect, useState } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import GroupEditModal from "./GroupEditModal";

const MessageContainer = () => {
  const [openEditModal, setOpenEditModal] = useState(false);

  const { selectedUser, authUser, onlineUser } = useSelector(
    (store) => store.user,
  );
  const { selectedGroup } = useSelector((state) => state.group);
  const { socket } = useSelector((store) => store.socket);

  const isOnline = selectedUser && onlineUser?.includes(selectedUser?._id);

  // ✅ JOIN / LEAVE GROUP SOCKET
  useEffect(() => {
    if (!selectedGroup?._id) return;

    socket?.emit("joinGroup", selectedGroup._id);

    return () => {
      socket?.emit("leaveGroup", selectedGroup._id);
    };
  }, [selectedGroup, socket]);

  return (
    <>
      {!selectedUser && !selectedGroup ? (
        <div className="w-full md:min-w-[550px] h-[100dvh] md:h-[80vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
          <h1 className="text-2xl md:text-4xl text-white font-bold">
            Hi, {authUser?.fullname}
          </h1>
          <h1 className="text-lg md:text-2xl text-white mt-2 dark:text-gray-800">
            Let's start conversation
          </h1>
        </div>
      ) : (
        <div className="w-screen md:min-w-[550px] md:max-w-[550px] h-[100dvh] md:h-[80vh] flex flex-col overflow-hidden">
          {/* 🔥 HEADER FIX */}
          <div className="flex items-center justify-between bg-gray-800 md:rounded-lg p-2 pl-15 md:pl-6 pr-4">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
              <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
                <div className="w-10 rounded-full">
                  <img
                    src={
                      selectedUser
                        ? selectedUser.profilePhoto
                        : selectedGroup.groupPhoto
                    }
                    alt="profile"
                  />
                </div>
              </div>

              <span className="text-white">
                {selectedUser ? selectedUser.fullname : selectedGroup.name}
              </span>
            </div>

            {/* RIGHT SIDE (Edit Button) */}
            {selectedGroup && (
              <button
                onClick={() => setOpenEditModal(true)}
                className="text-white text-sm bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
              >
                Edit
              </button>
            )}
          </div>

          <Messages />
          <SendInput />

          {/* MODAL */}
          <GroupEditModal open={openEditModal} setOpen={setOpenEditModal} />
        </div>
      )}
    </>
  );
};

export default MessageContainer;

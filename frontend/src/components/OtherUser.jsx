import React from "react";
import { setSelectedUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const OtherUser = (props) => {
  const dispatch = useDispatch();
  const user = props.user;
  const { selectedUser, onlineUser } = useSelector((store) => store.user);
  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
    props.closeSidebar?.();
  };

  const isOnline = onlineUser?.includes(user?._id);

  return (
    <div
      onClick={() => selectedUserHandler(user)}
      className={`${
        selectedUser?._id === user?._id ? "bg-blue-950" : ""
      }  flex gap-4 items-center hover:bg-blue-950 rounded-lg p-2 pr-15`}
    >
      {/* Profile photo  */}
      <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
        <div className="w-10 rounded-full">
          <img src={user?.profilePhoto} alt="userProfile" />
        </div>
      </div>

      {/* Name  */}
      <div>{user?.fullname}</div>
    </div>
  );
};

export default OtherUser;

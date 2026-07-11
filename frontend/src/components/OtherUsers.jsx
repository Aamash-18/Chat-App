import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";
const OtherUsers = (props) => {
  //call custome hook for getting data of other user from backend and this function store that data in redux store..
  useGetOtherUsers();

  // fetch data from redux store
  const { otherUser } = useSelector((store) => store.user);
  if (!otherUser) return null;

  const filteredUser = otherUser.filter((user) =>
    user.fullname.toLowerCase().includes(props.search.toLowerCase()),
  );

  return (
    <div>
      {(props.search === "" ? otherUser : filteredUser)?.map((user) => {
        return (
          <OtherUser
            key={user._id}
            user={user}
            closeSidebar={props.closeSidebar}
          />
        );
      })}
    </div>
  );
};

export default OtherUsers;

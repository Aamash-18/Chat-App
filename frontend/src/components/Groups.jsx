import React from "react";
import { useSelector } from "react-redux";
import Group from "./Group";
import useGetGroups from "../hooks/useGetGroups";

const Groups = (props) => {
  useGetGroups();
  const { groups } = useSelector((state) => state.group);
  const filteredGroup = groups?.filter((group) =>
    group.name.toLowerCase().includes(props.search.toLowerCase()),
  );
  return (
    <div className="mt-3">
      {(props.search === "" ? groups : filteredGroup)?.map((group) => (
        <Group
          key={group._id}
          group={group}
          closeSidebar={props.closeSidebar}
        />
      ))}
    </div>
  );
};

export default Groups;

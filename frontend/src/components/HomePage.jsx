import { useState } from "react";
import SideBar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import { FiMenu } from "react-icons/fi";
import CreateGroupModal from "./CreateGroupModal";

const HomePage = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const [open, setOpen] = useState(false);
  return (
    <div className="md:h-[500px] bg-gray-50 dark:bg-gray-900 md:rounded-lg relative overflow-hidden md:overflow-visible">
      {/* Mobile Toggle Button */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="md:hidden absolute top-4 left-6 z-50"
        >
          <FiMenu size={26} />
        </button>
      )}

      <div className="flex flex-col md:flex-row justify-center md:px-3 md:py-3 lg:py-5">
        {/* Sidebar */}
        <div
          className={`
            fixed md:static top-0 left-0 z-40 bg-gray-900
            w-[280px] md:w-auto h-full
            transition-transform duration-300 ease-in-out
            ${showSidebar ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <SideBar
            closeSidebar={() => setShowSidebar(false)}
            setOpen={setOpen}
          />
        </div>

        <CreateGroupModal open={open} setOpen={setOpen} />

        {/* Chat */}
        <div className="w-full md:w-auto md:ml-2">
          <MessageContainer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

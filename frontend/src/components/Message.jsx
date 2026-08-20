import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../config/api";

const Message = (props) => {
  const { authUser } = useSelector((store) => store.user);
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.message]);

  const formatIST = (utcDate) => {
    return new Date(utcDate).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const senderId =
    typeof props.message.senderId === "object"
      ? props.message.senderId._id
      : props.message.senderId;

  const isOwnMessage = authUser?._id === senderId;

  const fileUrl = props.message.fileUrl
    ? props.message.fileUrl.startsWith("http")
      ? props.message.fileUrl
      : `${API_BASE_URL}${props.message.fileUrl}`
    : null;

  return (
    <div ref={scroll} className="w-full flex flex-col mb-3">
      {/* 🔥 LEFT */}
      {!isOwnMessage && (
        <div className="flex items-start gap-2.5">
          {props.message.senderId?.profilePhoto && (
            <img
              className="w-8 h-8 rounded-full"
              src={props.message.senderId.profilePhoto}
              alt=""
            />
          )}

          <div className="flex flex-col max-w-[70%]">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="font-semibold">
                {props.message.senderId?.fullname}
              </span>
              <span>{formatIST(props.message.createdAt)}</span>
            </div>

            <div className="bg-zinc-800 text-white text-sm p-2 rounded-lg mt-1 break-words">
              {props.message.message && <p>{props.message.message}</p>}

              {/* 📸 IMAGE */}
              {fileUrl && props.message.fileType?.startsWith("image") && (
                <div className="mt-2 flex flex-col gap-1">
                  <img
                    src={fileUrl}
                    className="rounded-lg max-w-[200px] border border-gray-600 cursor-pointer"
                    alt="file"
                    onClick={() => window.open(fileUrl, "_blank")}
                  />

                  <a
                    href={fileUrl}
                    download
                    className="text-xs text-blue-400 underline"
                  >
                    ⬇️ Download
                  </a>
                </div>
              )}

              {/* 📁 FILE */}
              {fileUrl && !props.message.fileType?.startsWith("image") && (
                <a
                  href={fileUrl}
                  download
                  className="block mt-2 text-blue-400 underline"
                >
                  📎 Download File
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔥 RIGHT */}
      {isOwnMessage && (
        <div className="flex justify-end">
          <div className="flex flex-col max-w-[70%] items-end">
            <span className="text-xs text-gray-400 mb-1">
              {formatIST(props.message.createdAt)}
            </span>

            <div className="bg-blue-900 text-white text-sm p-2 rounded-lg break-words">
              {props.message.message && <p>{props.message.message}</p>}

              {/* 📸 IMAGE */}
              {fileUrl && props.message.fileType?.startsWith("image") && (
                <div className="mt-2 flex flex-col gap-1 items-end">
                  <img
                    src={fileUrl}
                    className="rounded-lg max-w-[200px] border border-blue-400 cursor-pointer"
                    alt="file"
                    onClick={() => window.open(fileUrl, "_blank")}
                  />

                  <a
                    href={fileUrl}
                    download
                    className="text-xs text-blue-300 underline"
                  >
                    ⬇️ Download
                  </a>
                </div>
              )}

              {/* 📁 FILE */}
              {fileUrl && !props.message.fileType?.startsWith("image") && (
                <a
                  href={fileUrl}
                  download
                  className="block mt-2 text-blue-300 underline"
                >
                  📎 Download File
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;

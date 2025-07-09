import React from "react";

const Loading = ({ global = true }: { global?: boolean }) => {
  return (
    <div
      className={`${
        global && "fixed bg-black/20 w-screen top-0 left-0 h-screen z-30"
      }  `}
    >
      <div
        className={`${
          global &&
          "relative top-1/2 flex justify-center left-1/2 translate-x-[-50%]  translate-y-[-50%]"
        }max-w-min`}
      >
        <div className={`relative w-16 h-16 ${!global && "scale-[.5]"}`}>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-l-green-500 border-r-green-500 animate-spin"></div>
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-green-500 border-b-green-500 animate-spin"
            style={{ animationDirection: "reverse" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

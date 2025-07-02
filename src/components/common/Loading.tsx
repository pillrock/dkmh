import React from "react";

const Loading = ({ size = 16 }: { size?: number }) => {
  return (
    <div className="fixed w-screen h-screen z-10 bg-black/20">
      <div className=" relative top-1/2 left-1/2 translate-x-[-50%]  max-w-min translate-y-[-50%]">
        <div className={`relative w-16 h-16 scale-[${size / 10}]`}>
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

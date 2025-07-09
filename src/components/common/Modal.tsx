import { ReactNode } from "react";

function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          onClose();
        }
      }}
      className="fixed w-screen top-0 left-0 z-20 h-screen grid bg-black/20 place-items-center"
    >
      <div className="max-h-[80%]  overflow-scroll w-full md:w-auto max-w-[85%] md:min-w-[50%] shadow-md bg-white border border-green-300">
        {children}
      </div>
    </div>
  );
}

export default Modal;

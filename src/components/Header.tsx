"use client";
import { useDataUser } from "@/contexts/dataUser";
import { LogOut, WifiIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  nameKeyLocalStorage,
  removeFromLocalStorage,
} from "@/lib/storage/localStorage";
// Header Component
export default function Header() {
  const { userInfoString_context, setIsLogin, setUserInfoString_context } =
    useDataUser();

  const handleLogout = () => {
    setUserInfoString_context("");
    removeFromLocalStorage(nameKeyLocalStorage.access_token);
    setIsLogin(false);
  };
  return (
    <header className="bg-white shadow-md px-4 md:px-[15%] 2xl:px-[20%] py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Image
          src="/vnua.png"
          alt="User Avatar"
          width={30}
          height={30}
          quality={100}
        />
      </div>

      <div className="flex items-center space-x-4">
        <span>
          <WifiIcon size={19} color="green" />
        </span>
        {userInfoString_context && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{userInfoString_context}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              <LogOut size={19} />
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
}

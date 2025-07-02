"use client";
import { useDataUser } from "@/contexts/dataUser";
import axios from "axios";
import { useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { KeyRoundIcon, User2Icon } from "lucide-react";
import {
  nameKeyLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage";
export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const { isLoading, setIsLoading, setUserInfoString_context, setIsLogin } =
    useDataUser();

  const handleWrongPassword = () => {
    setPassword("");
    passwordRef.current?.focus();
    animate(
      ".label-password",
      { x: [-10, 10, -8, 8, -4, 4, 0] },
      { duration: 0.6 }
    );
    animate(".password", { x: [-10, 10, -8, 8, -4, 4, 0] }, { duration: 0.6 });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/login", {
        username,
        password,
      });
      const dataRes = res.data;
      if (dataRes.ok) {
        const dataUser = dataRes.data;
        setUserInfoString_context(`${dataUser.userName}, ${dataUser.name}`);
        setIsLogin(true);
        saveToLocalStorage(
          nameKeyLocalStorage.access_token,
          dataUser.access_token
        );
        console.log(dataUser.access_token);
      } else {
        handleWrongPassword();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white p-4 shadow-md w-full rounded-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex ">
          <span className="p-2 content-center rounded-bl-lg rounded-tl-lg  bg-gray-200">
            <User2Icon size={19} />
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="676869"
            className="w-full px-3 py-2 border border-gray-300 rounded-tr-lg rounded-br-lg  focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex">
          <span className="p-2 label-password content-center rounded-bl-lg rounded-tl-lg border-[2px] border-transparent  bg-gray-200">
            <KeyRoundIcon size={19} />
          </span>
          <input
            type="password"
            value={password}
            ref={passwordRef}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full password px-3 py-2 border border-gray-300 rounded-tr-lg rounded-br-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-green-700 text-white rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </motion.button>
      </form>
    </div>
  );
}

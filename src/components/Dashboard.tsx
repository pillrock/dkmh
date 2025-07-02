"use client";

import { useDataUser } from "@/contexts/dataUser";
import Header from "./Header";
import LoginForm from "./LoginForm";
import { AnimatePresence, motion } from "motion/react";
import Loading from "./common/Loading";
import {
  getFromLocalStorage,
  nameKeyLocalStorage,
} from "@/lib/storage/localStorage";
import { useEffect } from "react";
import axios from "axios";
import { infoStudent_DATARESPONSE } from "@/services/api/vnua/dataTypeResponse";

type ApiResponse<T> = {
  ok: boolean;
  data: T;
  message: string;
};
export default function Dashboard() {
  const {
    isLogin,
    isLoading,
    setIsLoading,
    setIsLogin,
    setUserInfoString_context,
  } = useDataUser();
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const accessTokenService = getFromLocalStorage(
        nameKeyLocalStorage.access_token
      );
      if (accessTokenService) {
        const res = await axios.post<
          ApiResponse<
            infoStudent_DATARESPONSE<{ ma_sv: string; ten_day_du: string }>
          >
        >("/api/info-student", {
          access_token: accessTokenService,
        });
        console.log(res);

        const data = res.data;

        if (data.ok) {
          const dataService = data.data.data;
          console.log("ok");

          setUserInfoString_context(
            `${dataService.ma_sv}, ${dataService.ten_day_du}`
          );
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      }
      setIsLoading(false);
    })();
  }, [setIsLogin, setUserInfoString_context, setIsLoading]);
  return (
    <div className="">
      {isLoading && <Loading size={8} />}
      <div className="top-0 sticky">
        <Header />
      </div>
      <div className="min-h-screen  bg-gray-100 flex items-center justify-center">
        <AnimatePresence>
          {!isLogin ? (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <h1>Môn học đã đăng ký</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

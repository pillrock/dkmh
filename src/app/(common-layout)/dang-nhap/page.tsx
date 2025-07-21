"use client";
import { useGlobalState } from "@/contexts/globalState";
import useCheckTokenAlive from "@/hooks/useCheckTokenAlive";
import {
  getFromLocalStorage,
  nameKeyLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage";
import { delay } from "@/utils/delay";
import axios, { AxiosError, AxiosResponse } from "axios";
import { KeySquareIcon, LogInIcon, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

function LoginPage() {
  const [inputValue, setInputValue] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const [err, setErr] = useState<string | null>("");
  const { setIsLoading, isLoading } = useGlobalState();

  const router = useRouter();

  const { isLoad, data, startCallAPI } = useCheckTokenAlive();

  /// lấy accesstoken rồi check alive
  useEffect(() => {
    const access_token = getFromLocalStorage(nameKeyLocalStorage.access_token);
    if (access_token) {
      startCallAPI(access_token as string);
    } else {
      removeDataLocal();
    }
  }, []);

  /// setloading
  useEffect(() => {
    setIsLoading(isLoad);
  }, [isLoad, setIsLoading]);

  /// khi lấy được dữ liệu thì check xem ok không
  useEffect(() => {
    if (!isLoad && data) {
      if (data.ok) {
        router.push("/dang-ky-mon-hoc");
      } else {
        removeDataLocal();
      }
    }
  }, [isLoad, data, router]);

  const removeDataLocal = () => {
    removeFromLocalStorage(nameKeyLocalStorage.access_token);
    removeFromLocalStorage(nameKeyLocalStorage.dataUser);
  };

  const saveDataToLocal = (data: AxiosResponse) => {
    const dataFromSerer = data.data;
    const dataUser = dataFromSerer.data;
    saveToLocalStorage(nameKeyLocalStorage.access_token, dataUser.access_token);
    saveToLocalStorage(nameKeyLocalStorage.dataUser, {
      name: dataUser.name,
      ma_sv: dataUser.userName,
      id: dataUser.id,
    });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    ////////// reset err //////////////
    setIsLoading(true);
    setErr("");

    let isSuccess = false;

    while (!isSuccess) {
      try {
        const res = await axios.post("/api/login", inputValue);
        saveDataToLocal(res);
        router.push("/dang-ky-mon-hoc");
        isSuccess = true; // THOÁT loop ngay
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          /// nếu lỗi trả về là lỗi 401 (auth) hay 500 (server) thì dừng lại
          if (
            error.response?.status === 401 ||
            error.response?.status === 500
          ) {
            setIsLoading(false);
            isSuccess = true; // THOÁT loop ngay
          }
          setErr(error.response?.data.message || error?.message);
          setInputValue((prev) => ({ ...prev, password: "" }));
        }

        // Chờ 2 giây trước khi thử lại
        await delay(2000);
      }
    }
    setIsLoading(false);
  };
  return (
    <div className="grid place-items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="shadow-md gap-y-2 w-[300px] flex flex-col rounded-md p-4"
      >
        <div className="flex">
          <span className="bg-green-200 text-green-900 grid rounded-tl-md rounded-bl-md place-items-center p-2">
            <User2Icon size={19} />
          </span>
          <input
            className="outline-none flex-1  border-[1px] border-green-300 p-2 rounded-tr-md rounded-br-md"
            type="text"
            name=""
            value={inputValue?.username}
            onChange={(e) =>
              setInputValue((prev) => ({ ...prev, username: e.target.value }))
            }
            id=""
            required
          />
        </div>
        <div className="flex">
          <span className="bg-green-200 text-green-900 grid place-items-center rounded-tl-md rounded-bl-md p-2">
            <KeySquareIcon size={19} />
          </span>
          <input
            className="outline-none flex-1 border-[1px] border-green-300 p-2 rounded-tr-md rounded-br-md"
            type="password"
            name=""
            value={inputValue.password}
            onChange={(e) => {
              setInputValue((prev) => ({ ...prev, password: e.target.value }));
            }}
            id=""
            required
          />
        </div>
        {err && (
          <p className="text-sm break-words text-red-900 bg-red-200 p-1">
            {err}
          </p>
        )}
        <button
          type="submit"
          className="flex border-none hover:opacity-90 gap-x-2 py-2 bg-green-300 text-green-900 justify-center rounded-md cursor-pointer items-center"
        >
          <LogInIcon size={19} />
          <p>{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}</p>
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

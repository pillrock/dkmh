import axios, { AxiosError } from "axios";
import { useState } from "react";

const useCheckTokenAlive = () => {
  const [data, setData] = useState<{
    ok: boolean;
    message: string;
    data: unknown;
  } | null>(null);
  const [isLoad, setIsLoad] = useState(false);
  const startCallAPI = async (access_token: string) => {
    try {
      setIsLoad(true);
      const res = await axios.post("/api/check-token-alive", { access_token });
      setData({ data: res.data, ok: true, message: "" });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setData({
          ok: false,
          message: err.response?.data?.message || err.message,
          data: null,
        });
      }
    } finally {
      setIsLoad(false);
    }
  };
  return { data, isLoad, startCallAPI };
};

export default useCheckTokenAlive;

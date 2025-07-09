"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type GlobalStateType = {
  userInfoString_context: string;
  isLoading: boolean;
  isLogin: boolean;
  setIsLogin: (b: boolean) => void;
  setIsLoading: (b: boolean) => void;
  setUserInfoString_context: (b: string) => void;
};

const GlobalStateContext = createContext<GlobalStateType | null>(null);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userInfoString_context, setUserInfoString_context] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <GlobalStateContext.Provider
      value={{
        isLogin,
        setIsLogin,
        userInfoString_context,
        setUserInfoString_context,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateContext;
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

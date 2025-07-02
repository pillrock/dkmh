"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type dataUserType = {
  userInfoString_context: string;
  isLoading: boolean;
  isLogin: boolean;
  setIsLogin: (b: boolean) => void;
  setIsLoading: (b: boolean) => void;
  setUserInfoString_context: (b: string) => void;
};

const DataUserContext = createContext<dataUserType | null>(null);

export const DataUserProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userInfoString_context, setUserInfoString_context] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <DataUserContext.Provider
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
    </DataUserContext.Provider>
  );
};

export default DataUserContext;
export const useDataUser = () => {
  const context = useContext(DataUserContext);
  if (!context) {
    throw new Error("useDataUser must be used within a DataUserProvider");
  }
  return context;
};

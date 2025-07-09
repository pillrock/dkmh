"use client";

import Loading from "@/components/common/Loading";
import Header from "@/components/Header";
import { useGlobalState } from "@/contexts/globalState";
import {
  getFromLocalStorage,
  nameKeyLocalStorage,
} from "@/lib/storage/localStorage";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

function ClientLayout({ children }: { children: ReactNode }) {
  const { isLoading } = useGlobalState();
  const pathName = usePathname();

  const [dataUser, setDataUser] = useState<{
    ma_sv: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const user = getFromLocalStorage<{ ma_sv: string; name: string }>(
      nameKeyLocalStorage.dataUser
    );
    if (user) {
      setDataUser(user);
    }
  }, [pathName]);

  return (
    <>
      {isLoading && <Loading />}
      <div className="mt-12">
        <Header
          ma_sv={dataUser?.ma_sv || ""}
          ten_day_du={dataUser?.name || ""}
        />
      </div>
      <div className={`md:px-[10%] xl:px-[15%] p-2 min-h-screen antialiased`}>
        {children}
      </div>
    </>
  );
}

export default ClientLayout;

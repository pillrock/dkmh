"use client";
import { useGlobalState } from "@/contexts/globalState";
import useCheckTokenAlive from "@/hooks/useCheckTokenAlive";
import {
  getFromLocalStorage,
  nameKeyLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage";
import {
  AllDataSubject_DATARESPONSE_dataChild,
  data_ds_nhom_to,
  infoStudent_DATARESPONSE,
} from "@/services/api/vnua/dataTypeResponse";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "./SearchBox";
import TableBox from "./tableBox";
import RegisterBox from "./registerBox";
// import TestCallApi from "./TestCallApi";

type dataUser = {
  lop: string;
};
export interface DataSubjectOntable extends data_ds_nhom_to {
  ten_mon?: string;
  lop?: string;
}

function RegisterSubject() {
  const { setIsLoading } = useGlobalState();
  const router = useRouter();

  const { data, startCallAPI, isLoad } = useCheckTokenAlive();
  const [optionSortDataSubject, setOptionSortDataObject] = useState<
    string | null
  >("1");
  const [allDataSubject, setAllDataSubject] =
    useState<AllDataSubject_DATARESPONSE_dataChild | null>(null);
  // const [listDataSubjectOnTable, setListDataSubjectOnTable] = useState<
  //   DataSubjectOntable[] | null
  // >(null);
  const [subjectChosenFromSearch, setSubjectChosenFromSearch] = useState<
    string | null
  >(null);
  const [listSubjectRegister, setListSubjectRegister] = useState<
    DataSubjectOntable[]
  >([]);

  console.log(listSubjectRegister);
  console.log("subject choose: ", subjectChosenFromSearch);

  useEffect(() => {
    //// check token alive
    startCallAPI(
      getFromLocalStorage(nameKeyLocalStorage.access_token) as string
    );

    // lấy thêm dữ liệu của sinh viên
    const getMoreDataStudent = async () => {
      try {
        const dataUser = getFromLocalStorage<dataUser>(
          nameKeyLocalStorage.dataUser
        );
        if (dataUser?.lop) {
          return { ok: true };
        }
        const res: AxiosResponse<
          infoStudent_DATARESPONSE<{ data: { lop: string } }>
        > = await axios.post("/api/info-student", {
          access_token: getFromLocalStorage(nameKeyLocalStorage.access_token),
        });

        saveToLocalStorage(nameKeyLocalStorage.dataUser, {
          ...dataUser,
          lop: res.data.data.data.lop,
        });
        return { ok: true, ...res.data };
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log(error?.response?.data.message || error.message);
          return { ok: false, ...error?.response?.data };
        }
      }
    };

    //// lấy dữ liệu lớn của các môn học
    const getALlDataSubject = async () => {
      // không cần lấy dữ liệu môn học nữa
      // if (getFromLocalStorage(nameKeyLocalStorage.subjectsChosen)) {
      //   return;
      // }
      try {
        const res = await axios.post("/api/all-data-subject", {
          access_token: getFromLocalStorage(
            nameKeyLocalStorage.access_token
          ) as string,
        });
        // const res = await vnuaAPI.getAllDataSubject(
        //   getFromLocalStorage(nameKeyLocalStorage.access_token) as string
        // );
        console.log(res);

        setAllDataSubject(res.data.data.data); /// response của vnua
        return { ok: true, ...res.data };
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log(error?.response?.data.message || error.message);
          return { ok: false, ...error?.response?.data };
        }
      }
    };

    (async () => {
      try {
        setIsLoading(true);
        const [result, result2] = await Promise.all([
          getMoreDataStudent(),
          getALlDataSubject(),
        ]);
        console.log(result, result2);
      } catch (error) {
        console.error("#2342:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  const getNameSubjectFromCodeSubject = useCallback(
    (code: string): string => {
      const ds_mon_hoc = allDataSubject?.ds_mon_hoc;
      if (ds_mon_hoc && ds_mon_hoc?.length > 0) {
        for (let i = 0; i < ds_mon_hoc.length; i++) {
          const item = ds_mon_hoc[i];
          if (item.ma === code) {
            return item.ten;
          }
        }
      }
      return "notFound";
    },
    [allDataSubject?.ds_mon_hoc]
  );

  /////// xử lý token khi check xong
  useEffect(() => {
    if (!isLoad && data) {
      if (!data.ok) {
        router.push("/dang-nhap");
      }
    }
    // setIsLoading(isLoad);
  }, [isLoad, data, router, setIsLoading]);

  //// filter mặc định, các môn mở theo lớp
  const listDataSubjectOnTable = useMemo(() => {
    const nhom_to: DataSubjectOntable[] = allDataSubject?.ds_nhom_to ?? [];
    if (optionSortDataSubject === "1") {
      const lop = (
        getFromLocalStorage(nameKeyLocalStorage.dataUser) as { lop: string }
      )?.lop;
      const dataSubjectFilterByClass = nhom_to
        .filter((item) => item.ds_lop.includes(lop))
        .map((item) => ({
          ...item,
          lop,
          ten_mon: getNameSubjectFromCodeSubject(item.ma_mon),
        }));
      return dataSubjectFilterByClass;
    } else if (optionSortDataSubject === "2") {
      const dataSubjectFilterByCode = nhom_to
        .filter((item) => item.ma_mon === subjectChosenFromSearch)
        .map((item) => ({
          ...item,
          ten_mon: getNameSubjectFromCodeSubject(item.ma_mon),
        }));
      console.log("filter: ", dataSubjectFilterByCode);

      return dataSubjectFilterByCode;
    }
  }, [
    allDataSubject?.ds_nhom_to,
    getNameSubjectFromCodeSubject,
    optionSortDataSubject,
    subjectChosenFromSearch,
  ]);

  return (
    <div className="flex flex-col gap-y-4  min-h-screen">
      <h1 className="text-green-600 text-2xl pl-2 border-l-[5px] border-green-500">
        Đăng ký môn học
      </h1>
      <div className="grid md:grid-cols-2 gap-y-4 grid-cols-1">
        <div className="flex gap-x-2">
          <select
            name=""
            id=""
            value={optionSortDataSubject as string}
            onChange={(e) => setOptionSortDataObject(e.target.value)}
            className="p-2 bg-green-200 outline-green-600"
          >
            <option value="1">Môn học mở theo lớp K69CNTTA</option>
            <option value="2">Tìm kiếm môn học</option>
          </select>
          <RegisterBox
            data={listSubjectRegister}
            chooseSubjectRegister={setListSubjectRegister}
          />
        </div>
        {allDataSubject?.ds_mon_hoc && optionSortDataSubject === "2" && (
          <div className="flex md:justify-end">
            <SearchBox
              data={allDataSubject.ds_mon_hoc}
              setSubjectChosen={setSubjectChosenFromSearch}
            />
          </div>
        )}
      </div>
      <TableBox
        listData={listDataSubjectOnTable || []}
        chooseSubjectRegister={setListSubjectRegister}
      />
    </div>
  );
}

export default RegisterSubject;

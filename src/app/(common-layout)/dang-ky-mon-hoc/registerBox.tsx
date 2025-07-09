"use client";

import {
  CheckIcon,
  DatabaseBackup,
  Save,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { DataSubjectOntable } from "./page";
import Modal from "@/components/common/Modal";
import { useEffect, useMemo, useRef, useState } from "react";
import Loading from "@/components/common/Loading";
import {
  getFromLocalStorage,
  nameKeyLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage";
import axios, { AxiosError, AxiosResponse } from "axios";
import { delay } from "@/utils/delay";

type StatusSubject = {
  status: string;
  message?: string;
};

function RegisterBox({
  data = [],
  chooseSubjectRegister,
}: {
  data: DataSubjectOntable[];
  chooseSubjectRegister: (
    cb: (prev: DataSubjectOntable[]) => DataSubjectOntable[]
  ) => void;
}) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<DataSubjectOntable[]>([]);
  const [statusSubject, setStatusSubject] = useState<
    Record<string, StatusSubject>
  >({});
  const startRegisterRef = useRef(false);

  const timeDelay = 2000;
  const access_token = useMemo(() => {
    return (
      (getFromLocalStorage(nameKeyLocalStorage.access_token) as string) ?? ""
    );
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setDisplayData(data);
    } else {
      const fromLocal =
        getFromLocalStorage<DataSubjectOntable[]>(
          nameKeyLocalStorage.subjectsChosen
        ) ?? [];
      setDisplayData(fromLocal);
    }
  }, [data]);

  const callApiRegisterSubject = async (id_to_hoc: string) => {
    try {
      setStatusSubject((prev) => ({
        ...prev,
        [id_to_hoc]: {
          status: "waiting",
          message: "",
        },
      }));
      const res: AxiosResponse = await axios.post("/api/register-subject", {
        access_token,
        id_to_hoc,
      });
      return res.data.data.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return {
          is_thanh_cong: false,
          thong_bao_loi: "proxy ERROR: " + error?.response?.data.message,
        };
      }
      return {
        is_thanh_cong: false,
        thong_bao_loi: "Unknown error",
      };
    }
  };
  console.log("RERENDER");

  const handleRegisterSubject = async () => {
    startRegisterRef.current = true;
    const tasks = displayData.map(async (subject) => {
      setStatusSubject((prev) => ({
        ...prev,
        [subject.id_to_hoc]: {
          status: "waiting",
          message: "",
        },
      }));

      let result: { is_thanh_cong: string; thong_bao_loi: string };
      do {
        result = await callApiRegisterSubject(subject.id_to_hoc);

        setStatusSubject((prev) => ({
          ...prev,
          [subject.id_to_hoc]: {
            status: result.is_thanh_cong ? "done" : "fail",
            message: result.thong_bao_loi,
          },
        }));

        if (!result.is_thanh_cong) {
          //delay trong 1 môn, call lại nếu fail
          await delay(timeDelay);
        }
        if (
          result.thong_bao_loi ===
          "Trùng thời khóa biểu, tổng cộng trùng 20 tiết, vượt quá số tiết được phép trùng 15 tiết/ học kỳ."
        ) {
          break;
        }
        // delay mỗi môn
      } while (!result.is_thanh_cong && startRegisterRef.current);
      await delay(2000);
    });

    await Promise.all(tasks);
    console.log("pause or all done");
  };
  return (
    <>
      <span
        onClick={() => setIsOpenModal(true)}
        className="p-2 bg-green-200 text-green-800 hover:bg-green-300"
      >
        <Save size={19} />
      </span>
      {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(!isOpenModal)}>
          <div className="flex flex-col gap-y-3 p-2">
            <div className="flex justify-between sticky top-0 z-20">
              <h1 className="pl-2 flex-1 p-1 border-l-[5px] bg-white border-green-500  text-xl">
                Môn học đã chọn
              </h1>
              {startRegisterRef.current ? (
                <button
                  onClick={() => {
                    startRegisterRef.current = false;
                  }}
                  className="absolute text-red-800 font-semibold cursor-pointer border-none hover:opacity-80 right-0 top-0 mt-2 mr-2 bg-red-300 p-2"
                >
                  Dừng đăng ký
                </button>
              ) : (
                <button
                  onClick={handleRegisterSubject}
                  className="absolute text-green-800 font-semibold cursor-pointer border-none hover:opacity-80 right-0 top-0 mt-2 mr-2 bg-green-300 p-2"
                >
                  Đăng ký tất cả
                </button>
              )}
            </div>
            <div className=" p-4  pl-0 flex flex-col gap-y-4">
              {displayData && displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <div
                    className="p-3 bg-gray-100 flex justify-between"
                    key={index}
                  >
                    <div className="flex flex-col gap-y-2">
                      <span className="flex gap-x-2 items-center">
                        <p className="text-xs font-semibold text-green-900 flex bg-green-100 p-2">
                          {item.ma_mon}
                        </p>
                        <p>{item.ten_mon}</p>
                      </span>
                      <span className="flex gap-x-2">
                        <p className="p-1 border-dashed border-green-500 border ">
                          Nhóm: {item.nhom_to}
                        </p>
                        <p className="p-1 border-dashed border-green-500 border ">
                          Tổ: {item.to || "__"}
                        </p>
                      </span>
                      {statusSubject[item.id_to_hoc] &&
                        statusSubject[item.id_to_hoc]?.message && (
                          <p className="pt-1 border-t-[1px] border-gray-300 text-xs">
                            {statusSubject[item.id_to_hoc]?.message}
                          </p>
                        )}
                    </div>
                    <>
                      {statusSubject[item.id_to_hoc] &&
                      statusSubject[item.id_to_hoc]?.status == "done" ? (
                        <span className="bg-green-100 text-green-700 p-2 max-h-min">
                          <CheckIcon size={19} />
                        </span>
                      ) : statusSubject[item.id_to_hoc]?.status == "fail" ? (
                        <span className="bg-orange-100 text-orange-700 p-2 max-h-min">
                          <TriangleAlertIcon size={19} />
                        </span>
                      ) : statusSubject[item.id_to_hoc]?.status == "waiting" ? (
                        <Loading global={false} />
                      ) : (
                        <span
                          onClick={() => {
                            const subjects =
                              getFromLocalStorage<DataSubjectOntable[]>(
                                nameKeyLocalStorage.subjectsChosen
                              ) ?? [];

                            const filtered = subjects.filter(
                              (subject) => item.id_to_hoc !== subject.id_to_hoc
                            );

                            saveToLocalStorage(
                              nameKeyLocalStorage.subjectsChosen,
                              filtered
                            );
                            chooseSubjectRegister((prev) =>
                              prev.filter(
                                (subject) =>
                                  subject.id_to_hoc !== item.id_to_hoc
                              )
                            );
                          }}
                          className="p-1 bg-red-200 text-red-700 cursor-pointer max-h-min"
                        >
                          <XIcon size={19} />
                        </span>
                      )}
                    </>
                  </div>
                ))
              ) : (
                <div className=" flex bg-red-100 items-center gap-x-2">
                  <span className="p-2">
                    <DatabaseBackup size={19} />
                  </span>
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default RegisterBox;

"use client";

import {
  CheckIcon,
  DatabaseBackup,
  HardDriveUploadIcon,
  PauseIcon,
  Save,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { data_ds_nhom_to } from "@/services/api/vnua/dataTypeResponse";
import Modal from "@/components/common/Modal";
import { useEffect, useMemo, useState } from "react";
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
  data: data_ds_nhom_to[];
  chooseSubjectRegister: (
    cb: (prev: data_ds_nhom_to[]) => data_ds_nhom_to[]
  ) => void;
}) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<data_ds_nhom_to[]>([]);
  const [statusSubject, setStatusSubject] = useState<
    Record<string, StatusSubject>
  >({});
  const [startRegister, setStartRegister] = useState(false);

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
        getFromLocalStorage<data_ds_nhom_to[]>(
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
      return { ...res.data.data.data, message: res.data.data.message };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error?.response?.data.message.includes("expired")) {
          return {
            is_thanh_cong: false,
            thong_bao_loi: "PHIÊN ĐĂNG NHẬP HẾT HẠN, ĐĂNG NHẬP LẠI",
          };
        }
        return {
          is_thanh_cong: false,
          thong_bao_loi: "QUÁ TẢI" + error?.response?.data.message,
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
    if (displayData.length <= 0) return;
    setStartRegister(true);
    const ListErrorResponse_StopCallApi = [
      "vượt quá số tiết được phép trùng 15 tiết/ học kỳ.",
      "Môn đã đạt không cho cải thiện",
      "Nhóm tổ đã hết sĩ số. Vui lòng chọn nhóm tổ khác.",
      "Môn học đăng ký không thuộc CTĐT",
      "Cảnh báo: tài khoản của bạn không được đăng ký/hủy đăng ký ở thời điểm hiện tại.",
      "Tiếp tục đăng ký?",
      "expired",
    ];
    const tasks = displayData.map(async (subject) => {
      setStatusSubject((prev) => ({
        ...prev,
        [subject.id_to_hoc]: {
          status: "waiting",
          message: "",
        },
      }));

      let result: {
        is_thanh_cong: string;
        thong_bao_loi: string;
        message: string;
      };
      do {
        result = await callApiRegisterSubject(subject.id_to_hoc);

        setStatusSubject((prev) => ({
          ...prev,
          [subject.id_to_hoc]: {
            // result.message là những thông báo hỏi xem có tiếp tục đăng ký nếu: trùng lịch, ...
            /// mặc định sẽ bỏ qua
            status: result.is_thanh_cong && !result.message ? "done" : "fail",
            message:
              result.thong_bao_loi ||
              result.message.replace(
                "Tiếp tục đăng ký?",
                "MẶC ĐỊNH BỎ QUA, lên web trường đăng ký"
              ),
          },
        }));

        if (!result.is_thanh_cong) {
          //delay trong 1 môn, call lại nếu fail
          await delay(timeDelay);
        }

        // note: some return true ngay khi co phan tu thoa man
        const shouldSTOP = ListErrorResponse_StopCallApi.some((erStr) =>
          result.thong_bao_loi.includes(erStr)
        );
        if (shouldSTOP) break;
      } while (!result.is_thanh_cong && startRegister);
      // await delay(2000);
    });

    /// khi call xong hết rồi thì..
    await Promise.all(tasks);
    setStartRegister(false);
    // displayData.map((subject) => {
    //   setStatusSubject((prev) => ({
    //     ...prev,
    //     [subject.id_to_hoc]: {
    //       ...prev[subject.id_to_hoc],
    //       status: "gi cung duoc",
    //     },
    //   }));
    // });
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
              {startRegister ? (
                <button
                  onClick={() => {
                    setStartRegister(false);
                  }}
                  className="absolute flex gap-x-2 items-center text-red-800 font-semibold cursor-pointer border-none hover:opacity-80 right-0 top-0 mt-2 mr-2 bg-red-300 p-2"
                >
                  <PauseIcon size={19} />
                  <p>Dừng đăng ký</p>
                </button>
              ) : (
                <button
                  onClick={handleRegisterSubject}
                  className="absolute flex gap-x-2 items-center text-green-800 font-semibold cursor-pointer border-none hover:opacity-80 right-0 top-0 mt-2 mr-2 bg-green-300 p-2"
                >
                  <HardDriveUploadIcon size={19} />
                  <p>Đăng ký tất cả</p>
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
                    <div className="flex gap-x-2">
                      {statusSubject[item.id_to_hoc] &&
                      statusSubject[item.id_to_hoc]?.status == "done" ? (
                        <span className="bg-green-100 text-green-700 p-1  max-h-min">
                          <CheckIcon size={19} />
                        </span>
                      ) : statusSubject[item.id_to_hoc]?.status == "fail" ? (
                        <span className="bg-orange-100 text-orange-700 p-1  max-h-min">
                          <TriangleAlertIcon size={19} />
                        </span>
                      ) : statusSubject[item.id_to_hoc]?.status == "waiting" ? (
                        <Loading global={false} />
                      ) : (
                        ""
                      )}
                      <span
                        onClick={() => {
                          const subjects =
                            getFromLocalStorage<data_ds_nhom_to[]>(
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
                              (subject) => subject.id_to_hoc !== item.id_to_hoc
                            )
                          );
                        }}
                        className="p-1 bg-red-200 text-red-700 cursor-pointer max-h-min"
                      >
                        <XIcon size={19} />
                      </span>
                    </div>
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

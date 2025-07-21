"use client";
import {
  getFromLocalStorage,
  nameKeyLocalStorage,
} from "@/lib/storage/localStorage";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
// import TestCallApi from "./TestCallApi";
import { AlignJustifyIcon, DatabaseBackup, XIcon } from "lucide-react";
import { ds_kqdkmh } from "@/services/api/vnua/dataTypeResponse";
import { useGlobalState } from "@/contexts/globalState";
import Modal from "@/components/common/Modal";
function SubjectsRegistered() {
  const { setIsLoading } = useGlobalState();
  const [openModal, setOpenModal] = useState(false);
  const [dataInModal, setDataInModal] = useState<ds_kqdkmh | null>(null);
  // const [listDataSubjectOnTable, setListDataSubjectOnTable] = useState<
  //   DataSubjectOntable[] | null
  // >(null);
  const [dataSubjectsRegistered, setDataSubjectRegistered] = useState<
    ds_kqdkmh[] | null
  >(null);

  useEffect(() => {
    //// lấy dữ liệu môn học đã đăng ký
    const getResultRegisterSubjects = async () => {
      try {
        const res = await axios.post("/api/subjects-registered", {
          access_token: getFromLocalStorage(
            nameKeyLocalStorage.access_token
          ) as string,
        });

        setDataSubjectRegistered(res.data.data.data.ds_kqdkmh); /// response của vnua

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
        await Promise.all([getResultRegisterSubjects()]);
      } catch (error) {
        console.error("#2342:", error);
      } finally {
      }
    })();
  }, []);

  const dataTotalOfSubject = useMemo(() => {
    if (!dataSubjectsRegistered) return { totalSubjects: 0, so_tc: 0 };
    return {
      totalSubjects: dataSubjectsRegistered.length,
      so_tc: dataSubjectsRegistered.reduce(
        (total, itemLoop) => total + +itemLoop.to_hoc.so_tc,
        0
      ),
    };
  }, [dataSubjectsRegistered]);

  /// sort dataByDate
  const dataFilteredByDate = useMemo(() => {
    if (!dataSubjectsRegistered) return [];
    return dataSubjectsRegistered.sort((a, b) => {
      const dateA = new Date(a.ngay_dang_ky || "").getTime();
      const dateB = new Date(b.ngay_dang_ky || "").getTime();
      return dateA - dateB;
    });
  }, [dataSubjectsRegistered]);

  const tagDateformated = (dateString: string) => {
    const date = new Date(dateString);
    return (
      <td>
        {`${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`}
        <br />
        {`${date.getHours().toString().padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`}
      </td>
    );
  };

  const handleCancelSubject = async (id_to_hoc: string) => {
    const isConfirmed = window.confirm(
      "Có chắc chắn muốn hủy môn học này không?"
    );
    if (!isConfirmed) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post("/api/cancel-subject", {
        access_token: getFromLocalStorage(
          nameKeyLocalStorage.access_token
        ) as string,
        id_to_hoc,
      });

      if (res.data.data.data.is_thanh_cong) {
        setDataSubjectRegistered((prev) =>
          prev
            ? prev.filter((item) => item.to_hoc.id_to_hoc !== id_to_hoc)
            : null
        );
      }
      setIsLoading(false);
      return { ok: true, ...res.data };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data.message || error.message);
        return { ok: false, ...error?.response?.data };
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4  min-h-screen">
      <div className="flex gap-5 flex-wrap">
        <h1 className="text-green-600 text-2xl pl-2 border-l-[5px] border-green-500">
          Môn học đã đăng ký
        </h1>
        <p className="text-red-500 font-semibold flex items-end">
          {dataTotalOfSubject.totalSubjects} môn, {dataTotalOfSubject.so_tc} tín
          chỉ
        </p>
      </div>
      <div className="w-full overflow-scroll max-h-[500px] relative">
        <table className="text-gray-700 ">
          <thead className="sticky -top-1">
            <tr className="text-gray-100 bg-green-400">
              <th>Xóa</th>
              <th>Mã MH</th>
              <th>Tên môn học</th>
              <th>Nhóm</th>
              <th>Số TC</th>
              <th>Lớp</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái</th>
              <th>Thời khóa biểu</th>
            </tr>
          </thead>
          <tbody>
            {dataSubjectsRegistered && dataSubjectsRegistered.length > 0 ? (
              dataFilteredByDate.map((item, index) => (
                <tr
                  key={index}
                  className={` ${!item.enable_xoa && "text-gray-400"}`}
                >
                  <td>
                    <span
                      onClick={() => handleCancelSubject(item.to_hoc.id_to_hoc)}
                      className={`p-2 flex items-center
                   justify-center  hover:opacity-90 ${
                     item.enable_xoa
                       ? "bg-red-100 cursor-pointer"
                       : "bg-gray-100 pointer-events-none"
                   }`}
                    >
                      <XIcon size={19} />
                    </span>
                  </td>
                  <td>{item.to_hoc.ma_mon}</td>
                  <td>{item.to_hoc.ten_mon}</td>
                  <td>{item.to_hoc.nhom_to}</td>
                  <td className="font-bold">{item.to_hoc.so_tc}</td>
                  <td>{item.to_hoc.lop}</td>
                  {tagDateformated(item.ngay_dang_ky)}
                  <td>{item.dien_giai_enable_xoa}</td>
                  <td>
                    <span
                      onClick={() => {
                        setDataInModal(item);
                        setOpenModal(true);
                      }}
                      className="cursor-pointer p-2 flex items-center justify-center text-gray-700"
                    >
                      <AlignJustifyIcon size={19} />
                    </span>
                  </td>
                  {/* <td
                    style={{ textAlign: "left" }}
                    dangerouslySetInnerHTML={{ __html: item.to_hoc.tkb }}
                    className="text-sm"
                  ></td> */}
                </tr>
              ))
            ) : (
              <tr className=" flex bg-red-100 items-center gap-x-2">
                <td className="p-2">
                  <DatabaseBackup size={19} />
                  <p className="text-nowrap">Không có dữ liệu</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          {dataInModal && (
            <div className="p-4">
              <h1>
                {dataInModal.to_hoc.ma_mon} - {dataInModal.to_hoc.ten_mon}
              </h1>
              <div className="border-[1px] border-gray-300 ">
                <h1 className="bg-green-400 text-center text-white p-1">
                  Thời khóa biểu
                </h1>
                <div className="p-1">
                  <span
                    style={{ textAlign: "left" }}
                    dangerouslySetInnerHTML={{ __html: dataInModal.to_hoc.tkb }}
                    className="text-sm"
                  ></span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default SubjectsRegistered;

import React, { useEffect, useState } from "react";
import { BanIcon, Check, DatabaseBackup, Plus } from "lucide-react";
import {
  getFromLocalStorage,
  nameKeyLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage/localStorage";
import { data_ds_nhom_to } from "@/services/api/vnua/dataTypeResponse";

const TableBox: React.FC<{
  custom?: string[];
  listData: data_ds_nhom_to[];
  chooseSubjectRegister?: (
    fn: (prev: data_ds_nhom_to[]) => data_ds_nhom_to[]
  ) => void;
}> = ({ custom, listData, chooseSubjectRegister }) => {
  const [iconStates, setIconStates] = useState<Record<string, React.ReactNode>>(
    {}
  );
  console.log(listData);

  useEffect(() => {
    const subjectChosenFromLocal =
      getFromLocalStorage<data_ds_nhom_to[]>(
        nameKeyLocalStorage.subjectsChosen
      ) ?? [];

    if (subjectChosenFromLocal.length > 0) {
      subjectChosenFromLocal.forEach((subjectSaved) => {
        setIconStates((prev) => ({
          ...prev,
          [subjectSaved.id_to_hoc]: <Check size={19} />,
        }));
        if (chooseSubjectRegister) {
          chooseSubjectRegister((prev = []) => [...prev, subjectSaved]);
        }
      });
    }
  }, []);
  const handleChooseSubject = (item: data_ds_nhom_to, index: string) => {
    if (!chooseSubjectRegister) return;

    const subjectChosenFromLocal =
      getFromLocalStorage<data_ds_nhom_to[]>(
        nameKeyLocalStorage.subjectsChosen
      ) ?? [];

    if (subjectChosenFromLocal.length > 0) {
      subjectChosenFromLocal.forEach((subjectSaved) => {
        setIconStates((prev) => ({
          ...prev,
          [subjectSaved.id_to_hoc]: <Check size={19} />,
        }));
      });
    }

    const dataSubjectSave = {
      id_to_hoc: item.id_to_hoc,
      ma_mon: item.ma_mon,
      ten_mon: item.ten_mon,
      nhom_to: item.nhom_to,
      to: item.to,
    };
    /// người dùng nhấn môn chưa chọn
    if (!iconStates[item.id_to_hoc]) {
      setIconStates((prev) => ({ ...prev, [index]: <Check size={19} /> }));
      chooseSubjectRegister((prev = []) => [...prev, item]);

      // lưu vào local
      saveToLocalStorage(nameKeyLocalStorage.subjectsChosen, [
        ...(subjectChosenFromLocal || []),
        dataSubjectSave,
      ]);
    }
    /// người dùng nhấn môn chọn rồi
    else {
      setIconStates((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [index]: _, ...rest } = prev;
        return rest;
      });
      chooseSubjectRegister((prev = []) =>
        prev.filter((subject) => subject.id_to_hoc !== item.id_to_hoc)
      );

      // xóa môn học khỏi local
      saveToLocalStorage(
        nameKeyLocalStorage.subjectsChosen,
        subjectChosenFromLocal.filter(
          (subject) => subject.id_to_hoc !== item.id_to_hoc
        )
      );
    }
  };

  // const duplicateSchedule()

  return (
    <div className="w-full overflow-scroll max-h-[500px]">
      <table>
        <thead className="sticky -top-1">
          <tr className="text-gray-100 bg-green-400">
            {custom && custom.length > 0 ? (
              custom.map((item, index) => <th key={index}>{item}</th>)
            ) : (
              <>
                <th>Chọn môn</th>
                <th>Mã MH</th>
                <th>Tên môn học 1</th>
                <th>Nhóm</th>
                <th>Tổ</th>
                <th>Số TC</th>
                <th>Lớp</th>
                <th>Số lượng</th>
                <th>Còn lại</th>
                <th>Thời khóa biểu</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {listData && listData.length > 0 ? (
            listData.map((item, index) => (
              <tr
                className={`${
                  item.is_dk
                    ? "bg-green-100 hover:bg-green-200"
                    : "hover:bg-gray-100"
                }  text-gray-700`}
                key={index}
              >
                <td>
                  {!item.enable ? (
                    <span
                      className={`p-2 flex items-center bg-green-100
                     justify-center   ${"bg-gray-100"}`}
                      onClick={() => handleChooseSubject(item, item.id_to_hoc)}
                    >
                      <BanIcon size={19} />
                    </span>
                  ) : (
                    <span
                      className={`p-2 flex items-center
                     justify-center  hover:bg-green-100 cursor-pointer ${
                       iconStates[item.id_to_hoc]
                         ? "bg-green-100"
                         : "bg-gray-100"
                     }`}
                      onClick={() => handleChooseSubject(item, item.id_to_hoc)}
                    >
                      {iconStates[item.id_to_hoc] || <Plus size={19} />}
                    </span>
                  )}
                </td>
                <td>{item.ma_mon}</td>
                <td>{item.ten_mon}</td>
                <td>{item.nhom_to}</td>
                <td>{item.to}</td>
                <td className="font-bold">{item.so_tc_so}</td>
                <td>{item.lop}</td>
                <td className="font-semibold text-green-500">{item.sl_cp}</td>
                <td
                  className={`${
                    item.sl_cl <= 0 ? "text-red-500" : ""
                  } font-semibold`}
                >
                  {item.sl_cl}
                </td>
                <td
                  style={{ textAlign: "left" }}
                  dangerouslySetInnerHTML={{ __html: item.tkb }}
                  className="text-sm"
                ></td>
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
  );
};

export default TableBox;

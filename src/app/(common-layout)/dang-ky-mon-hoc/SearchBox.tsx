import { useDebounce } from "@/hooks/useDebounce";
import { data_ds_mon_hoc } from "@/services/api/vnua/dataTypeResponse";
import { Search } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

export default function SearchBox({
  data,
  setSubjectChosen,
}: {
  data: data_ds_mon_hoc[];
  setSubjectChosen: (ma: string) => void;
}) {
  const [inputSearch, setInputSearch] = useState("");
  const deouncedInputSearch = useDebounce(inputSearch, 200);
  const refInputSearch = useRef(null);

  const handleChooseSubject = useCallback(
    (ma_mon: string) => {
      setInputSearch("");
      setSubjectChosen(ma_mon);
    },
    [setSubjectChosen]
  );

  const listSearchResult = useMemo(() => {
    if (!deouncedInputSearch) {
      return [];
    }
    console.log("LỌC");
    return data.filter((item) =>
      item.ten.toLowerCase().includes(deouncedInputSearch.toLowerCase())
    );
  }, [deouncedInputSearch, data]);

  return (
    <div className="flex relative">
      <span className="bg-green-200 p-2 flex items-center text-green-700">
        <Search size={19} />
      </span>
      <input
        ref={refInputSearch}
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        placeholder="Tìm kiếm theo tên MH"
        className="outline-none border-[1px] border-green-300 p-2"
      />
      {listSearchResult.length > 0 && (
        <div className="absolute max-h-[200px] w-full border-green-300 border overflow-auto z-10 left-0 top-[100%] bg-white">
          {listSearchResult.map((item) => (
            <div
              key={item.ma}
              className="flex cursor-pointer flex-col p-2 hover:bg-green-200 border-b border-green-300"
              onClick={() => handleChooseSubject(item.ma)}
            >
              <p>{item.ten}</p>
              <p className="text-sm font-semibold">{item.ma}</p>
            </div>
          ))}
        </div>
      )}
      {inputSearch.length > 0 && listSearchResult.length <= 0 && (
        <div className="absolute max-h-[200px] w-full border-green-300 border overflow-auto z-10 left-0 top-[100%] bg-white">
          <div className="flex flex-col p-2 hover:bg-green-200 border-b border-green-300">
            Không tìm thấy môn học
          </div>
        </div>
      )}
    </div>
  );
}

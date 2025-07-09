import { LogOutIcon } from "lucide-react";
import Image from "next/image";

function Header({ ma_sv, ten_day_du }: { ma_sv: string; ten_day_du: string }) {
  return (
    <div className="md:px-[15%] z-10 bg-white px-2 fixed top-0 w-full items-center shadow-md flex justify-between py-2 xl:px-[20%]">
      <div>
        <Image
          src={"/vnua.webp"}
          quality={100}
          alt="logo"
          width={35}
          height={35}
        />
      </div>
      <div className="flex gap-x-2  items-center">
        {ma_sv && ten_day_du && (
          <span>
            {ma_sv}, {ten_day_du}
          </span>
        )}
        <span className="p-2 bg-red-300 text-red-700 cursor-pointer rounded-md">
          <LogOutIcon size={19} />
        </span>
      </div>
    </div>
  );
}

export default Header;

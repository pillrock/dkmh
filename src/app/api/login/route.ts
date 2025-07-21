import { NextRequest, NextResponse } from "next/server";
import * as vnuaAPI from "@/services/api/vnua/api";
export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const dataRes = await vnuaAPI.login(data.username, data.password);
    return NextResponse.json(
      { ok: true, data: dataRes, message: "success" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      const jsonResponse = {
        ok: false,
        message: error?.message || "Unknown error",
      };
      if (
        error?.message.indexOf("Vui lòng kiểm tra tên đăng nhập và mật khẩu")
      ) {
        return NextResponse.json(jsonResponse, { status: 401 });
      }
      return NextResponse.json(jsonResponse, { status: 500 });
    }
  }
}

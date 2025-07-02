import { NextRequest, NextResponse } from "next/server";
import * as vnuaAPI from "@/services/api/vnua/api";
export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const dataRes = await vnuaAPI.getInfoStudent(data.access_token);
    return NextResponse.json({ ok: true, data: dataRes, message: "success" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({
        ok: false,
        message: JSON.stringify(error?.message),
      });
    }
  }
}

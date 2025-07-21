import { NextRequest, NextResponse } from "next/server";
import * as vnuaAPI from "@/services/api/vnua/api";
export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const dataRes = await vnuaAPI.getSubjectsRegistered(data);
    return NextResponse.json(
      { ok: true, data: dataRes, message: "success" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: JSON.stringify(error?.message),
        },
        { status: 500 }
      );
    }
  }
}

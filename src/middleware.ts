import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  const body = await req.json();
  if (!body?.access_token) {
    NextResponse.redirect("/dang-nhap");
    return NextResponse.json(
      {
        ok: false,
        message: JSON.stringify("ACCESS_TOKEN not found"),
      },
      { status: 500 }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/all-data-subject",
    "/api/check-token-alive",
    "/api/info-student",
    "/api/register-subject",
  ],
};

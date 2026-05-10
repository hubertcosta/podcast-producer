import { NextRequest, NextResponse } from "next/server";
import { clearGoogleTokenRecord } from "@/lib/token-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  await clearGoogleTokenRecord();

  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}

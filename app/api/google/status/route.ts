import { NextResponse } from "next/server";
import { getGoogleTokenRecord } from "@/lib/token-store";

export const runtime = "nodejs";

export async function GET() {
  const tokenRecord = await getGoogleTokenRecord();

  return NextResponse.json({
    connected: Boolean(tokenRecord),
    connectedEmail: tokenRecord?.connectedEmail ?? null,
    connectedAt: tokenRecord?.connectedAt ?? null,
    scopes: tokenRecord?.scopes ?? [],
    hasRefreshToken: Boolean(tokenRecord?.tokens.refresh_token),
  });
}

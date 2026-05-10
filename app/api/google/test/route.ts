import { NextResponse } from "next/server";
import { testGoogleConnection } from "@/lib/google";
import { getGoogleTokenRecord } from "@/lib/token-store";

export const runtime = "nodejs";

export async function GET() {
  const tokenRecord = await getGoogleTokenRecord();

  if (!tokenRecord) {
    return NextResponse.json(
      { error: "Google is not connected yet." },
      { status: 401 },
    );
  }

  try {
    const result = await testGoogleConnection(tokenRecord.tokens);

    return NextResponse.json({
      connected: true,
      connectedEmail: tokenRecord.connectedEmail ?? null,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Google connection test failed.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

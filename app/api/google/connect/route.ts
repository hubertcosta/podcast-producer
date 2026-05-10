import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getGoogleAuthorizationUrl } from "@/lib/google";

export const runtime = "nodejs";

export async function GET() {
  try {
    const state = randomBytes(24).toString("hex");
    const response = NextResponse.redirect(getGoogleAuthorizationUrl(state));

    response.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      maxAge: 10 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start Google OAuth.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

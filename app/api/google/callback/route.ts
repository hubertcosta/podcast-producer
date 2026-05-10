import { NextRequest, NextResponse } from "next/server";
import { createGoogleOAuthClient, GOOGLE_SCOPES, getUserEmail } from "@/lib/google";
import { saveGoogleTokenRecord } from "@/lib/token-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const expectedState = request.cookies.get("google_oauth_state")?.value;

  if (!code) {
    return NextResponse.json(
      { error: "Google did not return an authorization code." },
      { status: 400 },
    );
  }

  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.json(
      { error: "Google OAuth state check failed. Please try connecting again." },
      { status: 400 },
    );
  }

  try {
    const oauthClient = createGoogleOAuthClient();
    const { tokens } = await oauthClient.getToken(code);
    const connectedEmail = await getUserEmail(tokens);

    await saveGoogleTokenRecord({
      tokens,
      connectedEmail,
      connectedAt: new Date().toISOString(),
      scopes: GOOGLE_SCOPES,
    });

    const response = NextResponse.redirect(new URL("/", requestUrl.origin));
    response.cookies.delete("google_oauth_state");

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to finish Google OAuth.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { google } from "googleapis";
import type { Credentials } from "google-auth-library";

export type GoogleConnectionTestResult = {
  gmailEmail: string | null;
  gmailMessagesTotal: number | null;
  calendarBusyBlocksNextSevenDays: number;
  checkedAt: string;
};

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
];

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getGoogleRedirectUri(): string {
  return `${getAppUrl().replace(/\/$/, "")}/api/google/callback`;
}

export function createGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables.",
    );
  }

  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    getGoogleRedirectUri(),
  );
}

export function createAuthorizedGoogleClient(tokens: Credentials) {
  const oauthClient = createGoogleOAuthClient();
  oauthClient.setCredentials(tokens);

  return oauthClient;
}

export function getGoogleAuthorizationUrl(state: string): string {
  const oauthClient = createGoogleOAuthClient();

  return oauthClient.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: GOOGLE_SCOPES,
    state,
  });
}

export async function getUserEmail(tokens: Credentials): Promise<string | undefined> {
  const oauthClient = createAuthorizedGoogleClient(tokens);

  const oauth2 = google.oauth2({ auth: oauthClient, version: "v2" });
  const { data } = await oauth2.userinfo.get();

  return data.email ?? undefined;
}

export async function testGoogleConnection(
  tokens: Credentials,
): Promise<GoogleConnectionTestResult> {
  const oauthClient = createAuthorizedGoogleClient(tokens);
  const gmail = google.gmail({ auth: oauthClient, version: "v1" });
  const calendar = google.calendar({ auth: oauthClient, version: "v3" });
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [gmailProfile, freeBusy] = await Promise.all([
    gmail.users.getProfile({ userId: "me" }),
    calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: sevenDaysFromNow.toISOString(),
        items: [{ id: "primary" }],
      },
    }),
  ]);

  return {
    gmailEmail: gmailProfile.data.emailAddress ?? null,
    gmailMessagesTotal: gmailProfile.data.messagesTotal ?? null,
    calendarBusyBlocksNextSevenDays:
      freeBusy.data.calendars?.primary?.busy?.length ?? 0,
    checkedAt: new Date().toISOString(),
  };
}

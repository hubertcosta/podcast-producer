import { promises as fs } from "node:fs";
import path from "node:path";
import type { Credentials } from "google-auth-library";

export type GoogleTokenRecord = {
  tokens: Credentials;
  connectedEmail?: string;
  connectedAt: string;
  scopes: string[];
};

const dataDirectory = path.join(process.cwd(), ".data");
const tokenFilePath = path.join(dataDirectory, "google-token.json");

export async function getGoogleTokenRecord(): Promise<GoogleTokenRecord | null> {
  try {
    const rawRecord = await fs.readFile(tokenFilePath, "utf8");
    return JSON.parse(rawRecord) as GoogleTokenRecord;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function saveGoogleTokenRecord(
  record: GoogleTokenRecord,
): Promise<void> {
  await fs.mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  await fs.writeFile(tokenFilePath, JSON.stringify(record, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });
}

export async function clearGoogleTokenRecord(): Promise<void> {
  try {
    await fs.rm(tokenFilePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

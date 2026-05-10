import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const envPath = new URL("../.env", import.meta.url);
const rl = readline.createInterface({ input, output });

function quote(value) {
  return JSON.stringify(value.trim());
}

async function askRequired(question) {
  const answer = await rl.question(question);

  if (!answer.trim()) {
    console.log("This value is required. Please run npm run setup:env again.");
    process.exitCode = 1;
    rl.close();
    return null;
  }

  return answer.trim();
}

try {
  if (existsSync(envPath)) {
    const overwrite = await rl.question(
      ".env already exists. Overwrite it? Type yes to continue: ",
    );

    if (overwrite.trim().toLowerCase() !== "yes") {
      console.log("No changes made.");
      process.exit(0);
    }
  }

  const clientId = await askRequired("Google OAuth Client ID: ");
  if (!clientId) {
    process.exit(1);
  }

  const clientSecret = await askRequired("Google OAuth Client Secret: ");
  if (!clientSecret) {
    process.exit(1);
  }

  const appUrlAnswer = await rl.question(
    "App URL [http://localhost:3000]: ",
  );
  const appUrl = appUrlAnswer.trim() || "http://localhost:3000";

  await writeFile(
    envPath,
    [
      `GOOGLE_CLIENT_ID=${quote(clientId)}`,
      `GOOGLE_CLIENT_SECRET=${quote(clientSecret)}`,
      `NEXT_PUBLIC_APP_URL=${quote(appUrl)}`,
      "",
    ].join("\n"),
    { mode: 0o600 },
  );

  console.log("Created .env.");
  console.log(`Use this Google redirect URI: ${appUrl}/api/google/callback`);
  console.log("Next: run npm run dev and click Connect Gmail & Calendar.");
} finally {
  rl.close();
}

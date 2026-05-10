# Podcast Producer Agent

This is a starter application for a podcast producer agent that can connect to
Gmail and Google Calendar with Google OAuth.

The first working feature is the connection screen:

- a dashboard at `http://localhost:3000`
- a **Connect Gmail & Calendar** button
- a Google OAuth callback route
- local token storage for development in `.data/google-token.json`
- a connection status endpoint at `/api/google/status`

> Do not paste Google passwords, 2FA codes, OAuth tokens, client secrets, or
> service account keys into chat. Put secrets only in your local `.env` file or
> your deployment provider's secret manager.

## What this app will request from Google

When you click the connect button, Google will ask for these permissions:

- Gmail send access
- Gmail modify access, so the app can read replies and label/archive threads
- Google Calendar event access
- Google Calendar free/busy access
- basic profile/email, so the app can confirm which Google account connected

The intended Google account is:

```txt
marcus@libecapital.com
```

## Beginner setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project picker at the top.
3. Click **New Project**.
4. Name it something like `Podcast Producer Agent`.
5. Click **Create**.

### 3. Enable the APIs

Inside the new project:

1. Go to **APIs & Services**.
2. Click **Enable APIs and Services**.
3. Search for **Gmail API** and enable it.
4. Search for **Google Calendar API** and enable it.

### 4. Configure the OAuth consent screen

1. Go to **APIs & Services** -> **OAuth consent screen**.
2. Choose **Internal** if your Workspace allows it. Otherwise choose
   **External**.
3. Fill in the required app name and support email.
4. Add yourself as a test user if Google asks for test users.
5. Save the consent screen.

### 5. Create OAuth credentials

1. Go to **APIs & Services** -> **Credentials**.
2. Click **Create Credentials**.
3. Choose **OAuth client ID**.
4. Choose **Web application**.
5. Add this authorized redirect URI:

```txt
http://localhost:3000/api/google/callback
```

6. Click **Create**.
7. Copy the **Client ID** and **Client Secret**.

### 6. Add environment variables

Copy the example file:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
GOOGLE_CLIENT_ID="paste-your-client-id-here"
GOOGLE_CLIENT_SECRET="paste-your-client-secret-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 7. Run the app

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Click **Connect Gmail & Calendar** and sign in with:

```txt
marcus@libecapital.com
```

After Google redirects back, the dashboard should show the connected email.

## Local development token storage

For this prototype, the OAuth token is saved locally at:

```txt
.data/google-token.json
```

That folder is ignored by Git. For a production deployment, replace this file
store with encrypted database storage or a managed secret store.

## Next product steps

After the Google connection works, the next useful milestones are:

1. Add a guest database.
2. Generate personalized outreach drafts.
3. Send outreach from Gmail.
4. Watch Gmail replies.
5. Classify replies as interested, not interested, follow-up later, or booked.
6. Check Google Calendar availability.
7. Create podcast recording calendar events.
8. Add daily outreach limits and safety controls.

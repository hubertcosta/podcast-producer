import { getAppUrl, getGoogleRedirectUri } from "@/lib/google";
import { getGoogleTokenRecord } from "@/lib/token-store";

function hasGoogleCredentials(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export default async function Home() {
  const tokenRecord = await getGoogleTokenRecord();
  const connectedEmail = tokenRecord?.connectedEmail;
  const isConfigured = hasGoogleCredentials();
  const appUrl = getAppUrl();
  const redirectUri = getGoogleRedirectUri();

  return (
    <main className="page">
      <div className="shell">
        <section className="hero">
          <div>
            <p className="eyebrow">Podcast Producer Agent</p>
            <h1>Connect Gmail and Calendar for outreach booking.</h1>
            <p className="lede">
              This starter app creates the secure Google OAuth connection your
              podcast producer agent needs before it can send outreach, read
              replies, and create calendar events.
            </p>
          </div>
        </section>

        <section className="card" aria-labelledby="connect-heading">
          <div
            className={`status ${
              connectedEmail ? "connected" : isConfigured ? "" : "needs-setup"
            }`}
          >
            {connectedEmail
              ? `Connected as ${connectedEmail}`
              : isConfigured
                ? "Ready to connect"
                : "Google credentials needed"}
          </div>

          <h2 id="connect-heading">Google connection</h2>
          <p>
            Use the button below to authorize Gmail and Google Calendar access
            for <code>marcus@libecapital.com</code>. Google will show the exact
            permissions before you approve.
          </p>

          {!isConfigured ? (
            <div className="error">
              Add <code>GOOGLE_CLIENT_ID</code> and{" "}
              <code>GOOGLE_CLIENT_SECRET</code> to your <code>.env</code> file,
              then restart the app.
            </div>
          ) : null}

          <div className="button-row">
            <a className="button" href="/api/google/connect">
              Connect Gmail & Calendar
            </a>
            <a className="button secondary" href="/api/google/status">
              View connection JSON
            </a>
          </div>
        </section>

        <section className="grid" aria-label="Setup checklist">
          <div className="step">
            <h3>1. Google Cloud</h3>
            <p>
              Create an OAuth client and add <code>{redirectUri}</code> as the
              authorized redirect URI.
            </p>
          </div>
          <div className="step">
            <h3>2. Environment</h3>
            <p>
              Copy <code>.env.example</code> to <code>.env</code> and paste the
              client ID and secret from Google Cloud.
            </p>
          </div>
          <div className="step">
            <h3>3. Authorize</h3>
            <p>
              Start the app at <code>{appUrl}</code>, click the connect button,
              and approve access as <code>marcus@libecapital.com</code>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

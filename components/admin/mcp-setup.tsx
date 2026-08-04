import { headers } from "next/headers";

/**
 * Setup guide rendered above the AI access keys list in the admin panel, so the
 * steps sit next to the button that creates the key rather than in a doc
 * someone has to be sent. Derives the address from the request so it is correct
 * on the deployed site and on localhost without a config value.
 */

const box: React.CSSProperties = {
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "6px",
  padding: "1.25rem 1.5rem",
  marginBottom: "1.5rem",
  background: "var(--theme-elevation-50)",
};

const code: React.CSSProperties = {
  display: "block",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  background: "var(--theme-elevation-100)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "4px",
  padding: "0.6rem 0.75rem",
  margin: "0.5rem 0 0",
  fontFamily: "var(--font-mono, ui-monospace, monospace)",
  fontSize: "0.8rem",
  lineHeight: 1.5,
};

const step: React.CSSProperties = { marginBottom: "0.85rem", lineHeight: 1.6 };
const heading: React.CSSProperties = { margin: "1.4rem 0 0.6rem", fontSize: "0.95rem" };

export async function McpSetup() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const url = `${proto}://${host}/api/mcp`;

  return (
    <div style={box}>
      <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.05rem" }}>
        Letting Claude edit this site
      </h3>
      <p style={{ margin: "0 0 1rem", lineHeight: 1.6, opacity: 0.85 }}>
        A key lets Claude read and change your content by chatting, instead of
        filling in these forms. Claude gets exactly the permissions the key&apos;s
        owner has — <strong>including deleting things</strong> — so treat a key
        like a password and delete any you stop using.
      </p>

      <h4 style={heading}>1. Create the key</h4>
      <div style={step}>
        Use <strong>Create new</strong> above. Give it a label describing where
        it will live, like &ldquo;Claude on my laptop&rdquo;.
      </div>
      <div style={step}>
        <strong>Then tick the permissions you want it to have.</strong> They all
        start switched off, so a key saved without touching them can do nothing
        at all — Claude will connect but see none of your content. Turn on the
        pages and collections it should reach.
      </div>
      <div style={step}>
        Save. The key is shown <strong>once</strong> — copy it before leaving the
        page. If you lose it, delete the key and make another.
      </div>
      <div style={step}>
        Adding something new later — a page, or a collection — means coming back
        and ticking it on for each existing key. New permissions are never
        granted retroactively.
      </div>

      <h4 style={heading}>2a. Claude desktop or mobile app</h4>
      <div style={step}>
        The easier route if you don&apos;t use a terminal. In Claude, open{" "}
        <strong>Settings → Connectors → Add custom connector</strong>, then paste
        this address:
        <code style={code}>{url}</code>
        When it asks for authentication, choose the option for a token or header
        and paste <code>Bearer YOUR-KEY</code>, replacing YOUR-KEY with what you
        copied.
      </div>

      <h4 style={heading}>2b. Claude Code (terminal)</h4>
      <div style={step}>
        Run this once, with your key in place of YOUR-KEY:
        <code style={code}>{`claude mcp add --transport http portfolio ${url} \\\n  --header "Authorization: Bearer YOUR-KEY"`}</code>
        Check it worked with <code>claude mcp list</code> — it should say{" "}
        <strong>Connected</strong> next to <code>portfolio</code>.
      </div>

      <h4 style={heading}>Adding photos and videos by chat</h4>
      <div style={step}>
        Claude cannot read files off your computer, so pointing it at something
        in your Downloads folder will fail. Either drag the file in here — which
        is usually quickest — or, if it is already online somewhere public, give
        Claude the link and ask it to upload from there. Share pages from Drive
        or Dropbox will not work; it has to be a direct link to the file itself.
      </div>

      <h4 style={heading}>3. Try it</h4>
      <div style={step}>
        Ask Claude something like <em>&ldquo;change the headline on my About page
        to …&rdquo;</em> or <em>&ldquo;add a reel titled … in the Money &amp;
        fintech category&rdquo;</em>. Changes appear on the live site straight
        away, exactly as if you had edited them here.
      </div>

      <p style={{ margin: "1.2rem 0 0", lineHeight: 1.6, opacity: 0.75, fontSize: "0.85rem" }}>
        A key reaches everything this panel does: reels, packages, uploads, every
        page&apos;s copy, your contact details, and the list of people who can
        sign in. Whoever holds it can do all of that as you.
      </p>
    </div>
  );
}

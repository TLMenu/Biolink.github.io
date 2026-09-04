import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, hashPassword } from "@/lib/auth";
import { getUserByEmail, getUserByUsername, createUser, updateProfile } from "@/lib/models";
import { randomUUID } from "crypto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error");

  const host = req.headers.get("host") || "telelumi-github-io.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  if (errorParam || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=auth_cancelled`);
  }

  const redirectUri = `${baseUrl}/api/auth/oauth/callback/${provider}`;

  try {
    let email = "";
    let username = "";
    let avatarUrl = "";
    let displayName = "";

    // 1. DISCORD
    if (provider === "discord") {
      const clientId = process.env.DISCORD_CLIENT_ID;
      const clientSecret = process.env.DISCORD_CLIENT_SECRET;
      if (!clientId || !clientSecret) throw new Error("Discord credentials missing");

      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      if (!accessToken) {
        console.error("Discord token exchange failed:", tokenData);
        throw new Error("No access token from Discord: " + JSON.stringify(tokenData));
      }

      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const dUser = await userRes.json();
      email = dUser.email;
      username = (dUser.username || `dc_${randomUUID().slice(0, 8)}`).replace(/[^a-zA-Z0-9_-]/g, "");
      displayName = dUser.global_name || dUser.username || username;
      if (dUser.avatar) {
        avatarUrl = `https://cdn.discordapp.com/avatars/${dUser.id}/${dUser.avatar}.png`;
      }
    }

    // 2. GITHUB
    else if (provider === "github") {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;
      if (!clientId || !clientSecret) throw new Error("GitHub credentials missing");

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      if (!accessToken) throw new Error("No access token from GitHub");

      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${accessToken}`,
          "User-Agent": "Biolink-App",
        },
      });
      const ghUser = await userRes.json();
      username = ghUser.login || `gh_${randomUUID().slice(0, 8)}`;
      displayName = ghUser.name || username;
      avatarUrl = ghUser.avatar_url || "";
      email = ghUser.email;

      if (!email) {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `token ${accessToken}`,
            "User-Agent": "Biolink-App",
          },
        });
        const emails = await emailsRes.json();
        if (Array.isArray(emails)) {
          const primary = emails.find((e: { primary?: boolean; verified?: boolean }) => e.primary && e.verified);
          email = primary ? primary.email : emails[0]?.email;
        }
      }
    }

    // 3. GOOGLE
    else if (provider === "google") {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) throw new Error("Google credentials missing");

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      if (!accessToken) throw new Error("No access token from Google");

      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const gUser = await userRes.json();
      email = gUser.email;
      displayName = gUser.name || "";
      avatarUrl = gUser.picture || "";
      username = (email ? email.split("@")[0] : `g_${randomUUID().slice(0, 8)}`).replace(/[^a-zA-Z0-9_-]/g, "");
    } else {
      return NextResponse.redirect(`${baseUrl}/login?error=unknown_provider`);
    }

    if (!email) {
      email = `${username.toLowerCase()}@oauth.${provider}.local`;
    }

    // Find or create user
    let user = await getUserByEmail(email);
    if (!user) {
      let finalUsername = username.slice(0, 20);
      let count = 1;
      while (await getUserByUsername(finalUsername)) {
        finalUsername = `${username.slice(0, 16)}_${count++}`;
      }

      const randomPassword = randomUUID() + randomUUID();
      const passwordHash = await hashPassword(randomPassword);
      user = await createUser(finalUsername, email, passwordHash);

      if (avatarUrl || displayName) {
        await updateProfile(user.id, {
          displayName: displayName || user.username,
          avatarUrl: avatarUrl || undefined,
        });
      }
    }

    await setSessionCookie(user.id);
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`);
  }
}

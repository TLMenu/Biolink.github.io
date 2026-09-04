import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(req.url);
  const host = req.headers.get("host") || "telelumi-github-io.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/auth/oauth/callback/${provider}`;

  if (provider === "github") {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        {
          error: "GitHub OAuth ist noch nicht eingerichtet.",
          detail: "Bitte trage GITHUB_CLIENT_ID und GITHUB_CLIENT_SECRET in Vercel ein.",
        },
        { status: 501 }
      );
    }
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=read:user,user:email`;
    return NextResponse.redirect(authUrl);
  }

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        {
          error: "Google OAuth ist noch nicht eingerichtet.",
          detail: "Bitte trage GOOGLE_CLIENT_ID und GOOGLE_CLIENT_SECRET in Vercel ein.",
        },
        { status: 501 }
      );
    }
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20profile%20email`;
    return NextResponse.redirect(authUrl);
  }

  if (provider === "discord") {
    const clientId = process.env.DISCORD_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        {
          error: "Discord OAuth ist noch nicht eingerichtet.",
          detail: "Bitte trage DISCORD_CLIENT_ID und DISCORD_CLIENT_SECRET in Vercel ein.",
        },
        { status: 501 }
      );
    }
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=identify%20email`;
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.json({ error: "Unbekannter Anbieter" }, { status: 400 });
}

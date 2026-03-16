import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[login route] fetch to Django failed:", err);
    return NextResponse.json({ detail: "Could not reach backend" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    console.error("[login route] non-JSON from Django:", upstream.status, await upstream.text());
    return NextResponse.json({ detail: "Unexpected response from backend" }, { status: 502 });
  }

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const isSecure = process.env.NODE_ENV === "production";
  const response = NextResponse.json(data, { status: 200 });

  response.cookies.set("access_token", data.access, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  response.cookies.set("refresh_token", data.refresh, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (refreshToken) {
    await fetch(`${API_BASE}/api/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ refresh: refreshToken }),
    }).catch(() => {
      // best-effort — clear cookies regardless
    });
  }

  const response = NextResponse.json({ detail: "Logged out" }, { status: 200 });
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.API_URL ?? "http://127.0.0.1:8000";

type ProxyOptions = {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
};

export async function api(
  path: string,
  { method = "GET", body, params }: ProxyOptions = {}
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    console.error("[django-proxy] fetch failed:", err);
    return NextResponse.json({ detail: "Could not reach backend" }, { status: 502 });
  }

  if (response.status === 204) {
    return NextResponse.json(null, { status: 204 });
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    console.error("[django-proxy] non-JSON response from Django:", response.status, await response.text());
    return NextResponse.json({ detail: "Unexpected response from backend" }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
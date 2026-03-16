import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL ?? "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const url = new URL(`${API_BASE}/api/buildings/export/`);
  request.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  } catch (err) {
    console.error("[buildings/export] fetch failed:", err);
    return NextResponse.json({ detail: "Could not reach backend" }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ detail: "Export failed" }, { status: response.status });
  }

  const blob = await response.arrayBuffer();
  return new NextResponse(blob, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        'attachment; filename="buildings.xlsx"',
    },
  });
}
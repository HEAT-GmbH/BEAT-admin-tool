import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL ?? "http://127.0.0.1:8000";

async function proxyToBackend(request: NextRequest, method: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const backendUrl = new URL(`${API_BASE}/api/buildings/files/`);

  // Forward all query params (building_uuid, type, file_id)
  request.nextUrl.searchParams.forEach((v, k) => backendUrl.searchParams.set(k, v));

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  // Forward Content-Type so Django can parse the multipart boundary
  const reqContentType = request.headers.get("content-type");
  if (reqContentType) {
    headers["Content-Type"] = reqContentType;
  }

  let response: Response;
  try {
    response = await fetch(backendUrl.toString(), {
      method,
      headers,
      body: method !== "GET" && method !== "DELETE" ? await request.blob() : undefined,
      // @ts-expect-error - duplex required for streaming body in Node fetch
      duplex: method !== "GET" && method !== "DELETE" ? "half" : undefined,
    });
  } catch (err) {
    console.error("[buildings/files proxy] fetch failed:", err);
    return NextResponse.json({ detail: "Could not reach backend" }, { status: 502 });
  }

  const resContentType = response.headers.get("content-type") ?? "";

  // File response — stream it back
  if (!resContentType.includes("application/json")) {
    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      status: response.status,
      headers: {
        "Content-Type": resContentType,
        "Content-Disposition": response.headers.get("Content-Disposition") ?? "",
      },
    });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: NextRequest) {
  return proxyToBackend(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, "POST");
}

export async function DELETE(request: NextRequest) {
  return proxyToBackend(request, "DELETE");
}

import { api } from "@/lib/django-proxy";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ step: string }> }
) {
  const { step } = await params;

  // The "details" step sends multipart/form-data (file uploads), so proxy it raw.
  if (step === "details") {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const formData = await request.formData();

    let response: Response;
    try {
      response = await fetch(`${API_BASE}/api/buildings/import/details/`, {
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: formData,
      });
    } catch (err) {
      console.error("[buildings/import/details] fetch failed:", err);
      return NextResponse.json(
        { detail: "Could not reach backend" },
        { status: 502 }
      );
    }

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  }

  // All other import steps send JSON.
  const body = await request.json();
  return api(`/api/buildings/import/${step}/`, { method: "POST", body });
}
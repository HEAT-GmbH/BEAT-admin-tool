import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ step: string }> }
) {
  const { step } = await params;
  const { searchParams } = request.nextUrl;

  // Only the "data" step supports GET (restore form fields).
  return api(`/api/buildings/add/${step}/`, {
    params: {
      building_uuid: searchParams.get("building_uuid") ?? undefined,
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ step: string }> }
) {
  const { step } = await params;
  const body = await request.json();
  return api(`/api/buildings/add/${step}/`, { method: "POST", body });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ step: string }> }
) {
  const { step } = await params;
  const body = await request.json();
  return api(`/api/buildings/add/${step}/`, { method: "DELETE", body });
}

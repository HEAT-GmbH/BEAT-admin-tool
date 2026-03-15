import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return api(`/api/system-settings/climate-types/${id}/`);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  return api(`/api/system-settings/climate-types/${id}/`, { method: "PATCH", body });
}
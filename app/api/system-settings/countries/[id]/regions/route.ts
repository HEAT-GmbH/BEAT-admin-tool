import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const search = request.nextUrl.searchParams.get("search") ?? undefined;
  return api(`/api/system-settings/countries/${id}/regions/`, {
    params: { search },
  });
}

import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const search = request.nextUrl.searchParams.get("search") ?? undefined;
  const regionId = request.nextUrl.searchParams.get("region_id") ?? undefined;
  return api(`/api/system-settings/countries/${id}/cities/`, {
    params: { search, region_id: regionId },
  });
}

import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return api("/api/system-settings/apartment-types/", {
    params: {
      building_type_id: searchParams.get("building_type_id") ?? undefined,
    },
  });
}

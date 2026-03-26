import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return api("/api/buildings/", {
    params: {
      search: searchParams.get("search") ?? undefined,
      country: searchParams.get("country") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      climate_zone: searchParams.get("climate_zone") ?? undefined,
      draft: searchParams.get("draft") ?? undefined,
      organisation: searchParams.get("organisation") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      page_size: searchParams.get("page_size") ?? undefined,
    },
  });
}
import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return api("/api/system-settings/climate-types/", {
    params: {
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      page_size: searchParams.get("page_size") ?? undefined,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return api("/api/system-settings/climate-types/", { method: "POST", body });
}
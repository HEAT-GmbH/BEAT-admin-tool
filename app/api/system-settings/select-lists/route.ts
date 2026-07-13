import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return api("/api/system-settings/select-lists/", {
    params: { type: searchParams.get("type") ?? undefined },
  });
}

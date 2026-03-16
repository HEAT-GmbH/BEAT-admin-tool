import { api } from "@/lib/django-proxy";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return api("/api/users/", {
    params: {
      search: searchParams.get("search") ?? undefined,
      role: searchParams.get("role") ?? undefined,
      organisation: searchParams.get("organisation") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      page_size: searchParams.get("page_size") ?? undefined,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return api("/api/users/", { method: "POST", body });
}

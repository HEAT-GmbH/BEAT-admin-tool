import { api } from "@/lib/django-proxy";

export async function GET() {
  return api("/api/auth/profile/");
}
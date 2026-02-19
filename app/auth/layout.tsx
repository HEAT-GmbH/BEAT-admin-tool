"use client";

import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/buildings");
    return null;
  }

  return <>{children}</>;
}

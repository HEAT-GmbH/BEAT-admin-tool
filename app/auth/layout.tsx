"use client";

import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/buildings");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (user) return null;

  return <>{children}</>;
}
"use client";

import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const checkUser = useEffectEvent(() => {
    if (user) {
      router.replace("/buildings");
    }
  });
  useEffect(() => {
    checkUser();
  }, [user]);

  return <>{children}</>;
}

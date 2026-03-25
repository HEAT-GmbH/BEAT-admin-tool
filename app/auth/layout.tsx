"use client";

import { Loader } from "@/components/loader";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useTransition } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const checkUser = useEffectEvent(() => {
    if (user) {
      startTransition(() => {
        router.replace("/buildings");
      });
    }
  });
  useEffect(() => {
    checkUser();
  }, [user]);

  return isPending ? (
    <div className="flex flex-col min-h-screen w-full items-center justify-center gap-4">
      <Loader size={32} />
      <h1 className="h5-title">Authenticated! Redirecting....</h1>
    </div>
  ) : (
    <>{children}</>
  );
}

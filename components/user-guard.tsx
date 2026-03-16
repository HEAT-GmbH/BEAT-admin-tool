"use client";

import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useEffectEvent } from "react";
import { Loader } from "./loader";

export default function UserGuard({ children }: PropsWithChildren) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const checkUser = useEffectEvent(() => {
    if (!user) {
      router.replace("/auth");
    }
  });
  useEffect(() => {
    checkUser();
  }, [user]);

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center flex-1">
        <Loader size={64} />
      </div>
    );
  }

  return !user ? null : <>{children}</>;
}

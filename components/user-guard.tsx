"use client";

import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useEffectEvent } from "react";
import { Loader } from "./loader";

export default function UserGuard({ children }: PropsWithChildren) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const isAuthorized = (u: typeof user) =>
    !!u && (u.is_staff || u.is_superuser || u.role === "superadmin" || u.role === "admin");

  const checkUser = useEffectEvent(() => {
    if (!isAuthorized(user)) {
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

  return !isAuthorized(user) ? null : <>{children}</>;
}

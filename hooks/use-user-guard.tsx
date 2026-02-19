"use client";
import { useAuth } from "@/contexts/auth.context";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";

export const useUserGuard = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center flex-1">
        <Loader size={64} />
      </div>
    );
  }

  if (!user) {
    router.replace("/auth");
    return null;
  }
};

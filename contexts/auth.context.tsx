"use client";
import type { User } from "@/models/auth";
import { apiService } from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useEffectEvent } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  isLoggingIn: boolean;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const {
    data: user = null,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => apiService.me(),
  });
  const router = useRouter();

  const { mutateAsync: loginFn, isPending: isLoggingIn } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.login(email, password),
    onSuccess: () => {
      toast.success("Logged in successfully");
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Login failed");
    },
  });

  const { mutateAsync: logoutFn, isPending: isLoggingOut } = useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const login = async (email: string, password: string) => {
    await loginFn({ email, password });
  };

  const logout = async () => {
    await logoutFn();
  };

  const checkAuthEffect = useEffectEvent((exists: boolean) => {
    if (!exists) {
      router.push("/auth");
    }
  });

  useEffect(() => {
    console.log(user);
    checkAuthEffect(!!user);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isLoggingIn, isLoggingOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

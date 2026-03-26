"use client";
import type { User } from "@/models/auth";
import { apiService } from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

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
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => apiService.me(),
  });
  const { mutate: loginFn, isPending: isLoggingIn } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Invalid email or password");
    },
  });

  const { mutate: logoutFn, isPending: isLoggingOut } = useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const login = async (email: string, password: string) => {
    await loginFn({ email, password });
  };

  const logout = async () => {
    await logoutFn();
  };


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

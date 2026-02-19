"use client";
import AppSidebar from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Loader } from "@/components/loader";
import { useAuth } from "@/contexts/auth.context";
import { useUserGuard } from "@/hooks/use-user-guard";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useUserGuard();

  return (
    <main className="flex items-stretch min-h-screen w-full">
      <AppSidebar />
      <section className="flex-1 flex flex-col bg-card border border-border rounded-l-[1rem]">
        <Header />
        <div className="p-8 border-t border-border flex-1">{children}</div>
      </section>
    </main>
  );
}

"use client";
import AppSidebar from "@/components/app-sidebar";
import { DashboardWrapper } from "@/components/dashboard-wrapper";
import { Header } from "@/components/header";
import { Loader } from "@/components/loader";
import UserGuard from "@/components/user-guard";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, setIsPending] = useState(false);

  return (
    <UserGuard>
      <main className="flex items-stretch min-h-screen w-full">
        <AppSidebar pendingState={setIsPending} />
        <section className="flex-1 flex flex-col bg-card border border-border rounded-l-[1rem]">
          <Header />
          {isPending ? (
            <div className="flex-1 border-t border-border flex items-center justify-center w-full">
              <Loader size={60} />
            </div>
          ) : (
            <DashboardWrapper>{children}</DashboardWrapper>
          )}
        </section>
      </main>
    </UserGuard>
  );
}

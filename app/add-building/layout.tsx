"use client";

import { Logo } from "@/components/logo";
import { useUserGuard } from "@/hooks/use-user-guard";
import { ContentWrapper } from "@/screens/add-building/content-wrapper";
import { AddBuildingProvider } from "@/screens/add-building/context";
import { AddBuildingFooter } from "@/screens/add-building/footer";
import { AddBuildingHeader } from "@/screens/add-building/header";
import { AddBuildingProgress } from "@/screens/add-building/progress";
import { StepInfo } from "@/screens/add-building/step-info";
import { AddBuildingSteps } from "@/screens/add-building/steps";
import { PropsWithChildren } from "react";

export default function AddBuildingLayout({ children }: PropsWithChildren) {
  useUserGuard();

  return (
    <AddBuildingProvider>
      <main className="flex items-stretch min-h-screen w-full">
        <aside className="size-full w-98.75">
          <div className="px-13 pt-7.5 pb-5 border-b border-border">
            <Logo width={57.5} height={23} />
            <div className="space-y-1 mt-6 mb-4">
              <h4 className="text-base font-extrabold text-foreground">
                Add New Building
              </h4>
              <p className="text-sm font-medium text-(--text--sub-600)">
                Complete the following steps to add a new building
              </p>
            </div>
            <AddBuildingProgress />
          </div>
          <div className="px-13 py-8">
            <AddBuildingSteps />
          </div>
        </aside>
        <section className="flex-1 flex flex-col bg-card border border-border rounded-l-[1rem]">
          <AddBuildingHeader />
          <div className="p-8 border-t border-border flex-1 flex flex-col items-center">
            <div className="w-full max-w-167 flex-1">
              <StepInfo />
              <ContentWrapper>{children}</ContentWrapper>
            </div>
          </div>
          <AddBuildingFooter />
        </section>
      </main>
    </AddBuildingProvider>
  );
}

"use client";

import { Logo } from "@/components/logo";
import { EditContentWrapper } from "@/screens/edit-building/content-wrapper";
import { EditBuildingProvider } from "@/screens/edit-building/context";
import { EditBuildingFooter } from "@/screens/edit-building/footer";
import { EditBuildingHeader } from "@/screens/edit-building/header";
import { EditBuildingProgress } from "@/screens/edit-building/progress";
import { EditStepInfo } from "@/screens/edit-building/step-info";
import { EditBuildingSteps } from "@/screens/edit-building/steps";
import { PropsWithChildren, use } from "react";

export default function EditBuildingLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const { id } = use(params);

  return (
    <EditBuildingProvider editBuildingId={id}>
      <div className="fixed inset-0 z-50 bg-background flex items-stretch">
        <aside className="size-full w-98.75 overflow-y-auto border-r border-border">
          <div className="px-13 pt-7.5 pb-5 border-b border-border">
            <Logo width={57.5} height={23} />
            <div className="space-y-1 mt-6 mb-4">
              <h4 className="text-base font-extrabold text-foreground">
                Edit Building
              </h4>
              <p className="text-sm font-medium text-(--text--sub-600)">
                Update the building information below
              </p>
            </div>
            <EditBuildingProgress />
          </div>
          <div className="px-13 py-8">
            <EditBuildingSteps />
          </div>
        </aside>
        <section className="flex-1 flex flex-col bg-card border border-border rounded-l-[1rem] overflow-hidden">
          <EditBuildingHeader />
          <div className="p-8 border-t border-border flex-1 flex flex-col items-center overflow-y-auto">
            <div className="w-full max-w-167 flex-1">
              <EditStepInfo />
              <EditContentWrapper>{children}</EditContentWrapper>
            </div>
          </div>
          <EditBuildingFooter />
        </section>
      </div>
    </EditBuildingProvider>
  );
}

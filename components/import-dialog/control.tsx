"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { steps, useSteps } from "./steps.context";
import { cn } from "@/lib/utils";
import React from "react";
import { Icon } from "@/components/icon";

export const Control = () => {
  const { step, setStep, isCompleted } = useSteps();
  return (
    <div className="w-full px-5 pb-4 pt-2 border-b border-border">
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((item, index) => (
            <React.Fragment key={item.id}>
              <BreadcrumbItem>
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {!isCompleted(item.id) ? (
                    <span
                      className={cn(
                        "label-x-small size-5 rounded-full border border-border grid place-items-center",
                        step === index
                          ? "bg-(--blue--500) border-transparent text-white"
                          : "text-(--text--sub-600)",
                      )}
                    >
                      {index + 1}
                    </span>
                  ) : (
                    <Icon
                      name="select-box-circle-fill"
                      size={20}
                      className="text-(--state--success--base)"
                    />
                  )}
                  <span
                    className={cn(
                      "paragraph-small text-(--text--sub-600)",
                      step === index && "text-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </BreadcrumbItem>
              {index < steps.length - 1 ? <BreadcrumbSeparator /> : null}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

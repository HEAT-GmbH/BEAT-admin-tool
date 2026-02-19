"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  TransitionStartFunction,
  useContext,
  useEffect,
  useEffectEvent,
  useTransition,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { STEPS } from "./step-lists";
import { AddBuildingStepConfig } from "@/models/building";
import { schema, type AddBuildingForm } from "./schema";

interface AddBuildingContext {
  stepBadge: { current: number; total: number } | null;
  title: string;
  description: string;
  tip: string | null;
  completed: Record<string, boolean>;
  goBack: () => void;
  skip: () => void;
  next: () => void;
  canSkip: () => boolean;
  canNext: () => boolean;
  activeMainStep: AddBuildingStepConfig | undefined;
  activeSubStep: AddBuildingStepConfig | undefined;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

const AddBuildingContext = createContext<AddBuildingContext | undefined>(
  undefined,
);

export const AddBuildingProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isActive = (main: string, sub?: string) =>
    pathname.startsWith("/add-building" + main + (sub ? sub : ""));
  const activeMainStep = STEPS.find((step) => isActive(step.path));
  const activeSubStep = activeMainStep?.steps?.find((step) =>
    isActive(activeMainStep.path, step.path),
  );

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const goBack = () => {
    let path = "/add-building";
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id > 1) {
        path +=
          activeMainStep.path +
          activeMainStep.steps?.[activeSubStep.id - 1].path;
      } else {
        path += activeMainStep.path;
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id > 1) {
        path += STEPS[activeMainStep.id - 1].path;
      } else {
        startTransition(() => {
          router.back();
        });
        return;
      }
    }
    startTransition(() => {
      router.push(path);
    });
  };

  const skip = () => {
    let path = "/add-building";
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id < activeMainStep.steps!.length + 1) {
        path +=
          activeMainStep.path +
          activeMainStep.steps?.[activeSubStep.id + 1].path;
      } else {
        if (activeMainStep.id < STEPS.length + 1) {
          path += STEPS[activeMainStep.id + 1].path;
        } else return;
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id < STEPS.length + 1) {
        path += STEPS[activeMainStep.id + 1].path;
      } else {
        startTransition(() => {
          router.back();
        });
        return;
      }
    }
    startTransition(() => {
      router.push(path);
    });
  };

  const next = () => {
    let path = "/add-building";
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id < activeMainStep.steps!.length + 1) {
        path +=
          activeMainStep.path +
          activeMainStep.steps?.[activeSubStep.id + 1].path;
      } else {
        if (activeMainStep.id < STEPS.length + 1) {
          path += STEPS[activeMainStep.id + 1].path;
        } else {
          handleSubmit(onSubmit)();
          return;
        }
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id < STEPS.length + 1) {
        path += STEPS[activeMainStep.id + 1].path;
      } else {
        handleSubmit(onSubmit)();
        return;
      }
    }
    startTransition(() => {
      router.push(path);
    });
  };

  const canSkip = (): boolean => {
    if (activeSubStep) {
      return activeSubStep.id < activeMainStep!.steps!.length + 1;
    } else if (activeMainStep && !activeSubStep) {
      return activeMainStep.id < STEPS.length + 1;
    }
    return false;
  };

  const canNext = (): boolean => {
    if (activeSubStep) {
      return (
        completed[`${activeMainStep!.id}-${activeSubStep.id}`] &&
        activeSubStep.id < activeMainStep!.steps!.length + 1
      );
    } else if (activeMainStep && !activeSubStep) {
      return (
        completed[`${activeMainStep.id}`] &&
        activeMainStep.id < STEPS.length + 1
      );
    }
    return false;
  };

  const { getFieldState, handleSubmit, ...methods } = useForm<AddBuildingForm>({
    resolver: zodResolver(schema),
  });

  const completed: Record<string, boolean> = {
    "1": getFieldState("buildingInformation").invalid,
    "1-1": getFieldState("buildingInformation.buildingNameLocation").invalid,
    "1-2": getFieldState("buildingInformation.buildingDetails").invalid,
    "2": getFieldState("operationalDetails").invalid,
    "2-1": getFieldState("operationalDetails.operationalScheduleTemperature")
      .invalid,
    "2-2": getFieldState("operationalDetails.coolingSystem").invalid,
    "2-3": getFieldState("operationalDetails.ventilationSystem").invalid,
    "2-4": getFieldState("operationalDetails.lightingSystem").invalid,
    "2-5": getFieldState("operationalDetails.liftEscalatorSystem").invalid,
    "2-6": getFieldState("operationalDetails.hotWaterSystem").invalid,
  };

  const onSubmit = (data: AddBuildingForm) => {
    console.log(data);
  };

  const prefetchEvent = useEffectEvent(() => {
    STEPS.forEach((step) => {
      if (step.steps) {
        step.steps.forEach((subStep) => {
          router.prefetch(step.path + subStep.path);
        });
      }
      router.prefetch(step.path);
    });
  });

  useEffect(() => {
    prefetchEvent();
  }, []);

  return (
    <AddBuildingContext.Provider
      value={{
        stepBadge: activeSubStep
          ? {
              current: activeSubStep.id,
              total: activeMainStep?.steps?.length || 0,
            }
          : null,
        title: activeSubStep
          ? activeSubStep.title || activeSubStep.label
          : activeMainStep?.title || "",
        description: activeSubStep
          ? activeSubStep.description
          : activeMainStep?.description || "",
        tip: activeSubStep
          ? activeSubStep.tip || null
          : activeMainStep?.tip || null,
        completed,
        goBack,
        skip,
        next,
        canSkip,
        canNext,
        activeMainStep,
        activeSubStep,
        isPending,
        startTransition,
      }}
    >
      <FormProvider
        getFieldState={getFieldState}
        handleSubmit={handleSubmit}
        {...methods}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {children}
        </form>
      </FormProvider>
    </AddBuildingContext.Provider>
  );
};

export const useAddBuilding = () => {
  const context = useContext(AddBuildingContext);
  if (!context) {
    throw new Error("useAddBuilding must be used within AddBuildingProvider");
  }
  return context;
};

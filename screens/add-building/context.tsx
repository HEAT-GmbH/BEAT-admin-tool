"use client";
import { AddBuildingStepConfig } from "@/models/building";
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
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { schema, type AddBuildingForm } from "./schema";
import { STEPS } from "./step-lists";

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
  const { handleSubmit, control, ...methods } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const goBack = () => {
    let path = "/add-building";
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id > 1) {
        path +=
          activeMainStep.path +
          activeMainStep.steps?.[activeSubStep.id - 2].path;
      } else {
        if (activeMainStep.id === 1) {
          startTransition(() => {
            router.back();
          });
          return;
        } else {
          const nextMain = STEPS[activeMainStep.id - 2];
          if (!nextMain.steps) {
            path += nextMain.path;
          } else {
            path +=
              nextMain.path + nextMain.steps[nextMain.steps.length - 1].path;
          }
        }
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id > 1) {
        path += STEPS[activeMainStep.id - 2].path;
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
      if (activeSubStep.id < activeMainStep.steps!.length) {
        path +=
          activeMainStep.path + activeMainStep.steps?.[activeSubStep.id].path;
      } else {
        if (activeMainStep.id < STEPS.length + 1) {
          path += STEPS[activeMainStep.id].path;
        } else return;
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id < STEPS.length + 1) {
        path += STEPS[activeMainStep.id].path;
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
      if (activeSubStep.id < activeMainStep.steps!.length) {
        path +=
          activeMainStep.path + activeMainStep.steps?.[activeSubStep.id].path;
      } else {
        if (activeMainStep.id < STEPS.length + 1) {
          path += STEPS[activeMainStep.id].path;
        } else {
          handleSubmit(onSubmit)();
          return;
        }
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id < STEPS.length + 1) {
        path += STEPS[activeMainStep.id].path;
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

  const buildingInformation = useWatch({
    control,
    name: "buildingInformation",
  });
  const operationalDetails = useWatch({
    control,
    name: "operationalDetails",
  });

  const completed: Record<string, boolean> = {
    "1": !!schema.shape.buildingInformation.safeParse(buildingInformation)
      .success,
    "1-1":
      !!schema.shape.buildingInformation.shape.buildingNameLocation.safeParse(
        buildingInformation?.buildingNameLocation,
      ).success,
    "1-2": !!schema.shape.buildingInformation.shape.buildingDetails.safeParse(
      buildingInformation?.buildingDetails,
    ).success,
    "2": !!schema.shape.operationalDetails.safeParse(operationalDetails)
      .success,
    "2-1":
      !!schema.shape.operationalDetails.shape.operationalScheduleTemperature.safeParse(
        operationalDetails?.operationalScheduleTemperature,
      ).success,
    "2-2": !!schema.shape.operationalDetails.shape.coolingSystem.safeParse(
      operationalDetails?.coolingSystem,
    ).success,
    "2-3": !!schema.shape.operationalDetails.shape.ventilationSystem.safeParse(
      operationalDetails?.ventilationSystem,
    ).success,
    "2-4": !!schema.shape.operationalDetails.shape.lightingSystem.safeParse(
      operationalDetails?.lightingSystem,
    ).success,
    "2-5":
      !!schema.shape.operationalDetails.shape.liftEscalatorSystem.safeParse(
        operationalDetails?.liftEscalatorSystem,
      ).success,
    "2-6": !!schema.shape.operationalDetails.shape.hotWaterSystem.safeParse(
      operationalDetails?.hotWaterSystem,
    ).success,
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
      <FormProvider handleSubmit={handleSubmit} control={control} {...methods}>
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

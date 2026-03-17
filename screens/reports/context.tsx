"use client";

import { reportSchema } from "@/models/report.schema";
import { GeneratedReport, ReportSchema } from "@/models/reports";
import { apiService } from "@/services/api.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface ReportContext {
  generatedReport: GeneratedReport | null;
  isGenerating: boolean;
  generateError: Error | null;
  resetReport: () => void;
  paramsUsed: ReportSchema;
}

const context = createContext<ReportContext | null>(null);

export const ReportProvider = ({ children }: { children: React.ReactNode }) => {
  const { handleSubmit, ...methods } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: "building_emission",
      config: {
        building: "",
        year: "",
      },
    },
  });
  const [paramsUsed, setParamsUsed] = useState<ReportSchema>({
    type: "building_emission",
    config: {
      building: "",
      year: "",
    },
  });

  const {
    data: generatedReport = null,
    mutate,
    isPending: isGenerating,
    error: generateError,
    reset: resetReport,
  } = useMutation({
    mutationFn: (params: ReportSchema) => {
      setParamsUsed(params);
      return apiService.generateReport(params);
    },
  });

  const onSubmit = (data: ReportSchema) => {
    console.log(data);
    mutate(data);
  };

  return (
    <context.Provider
      value={{
        generatedReport,
        isGenerating,
        generateError,
        resetReport,
        paramsUsed,
      }}
    >
      <FormProvider handleSubmit={handleSubmit} {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid size-full">
          {children}
        </form>
      </FormProvider>
    </context.Provider>
  );
};

export const useReportContext = () => {
  const ctx = useContext(context);
  if (!ctx)
    throw new Error("useReportContext must be used within ReportProvider");
  return ctx;
};

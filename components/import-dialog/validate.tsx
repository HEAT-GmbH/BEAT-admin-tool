"use client";
import { Icon } from "@/components/icon";
import { Progress } from "@/components/progress";
import { Button } from "@/components/ui/button";
import { delay } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSteps, ValidationResult } from "./steps.context";

export const Validate = () => {
  const { validationResult, setValidationResult, toggleComplete, item } =
    useSteps();
  const [progress, setProgress] = useState(0);

  // Simulation effect
  useEffect(() => {
    // If we already have a result, don't re-run unless we decide to clear it elsewhere
    if (
      validationResult?.status === "success" ||
      validationResult?.status === "warning" ||
      validationResult?.status === "error"
    ) {
      setProgress(100);
      return;
    }

    const runValidation = async () => {
      setValidationResult({
        status: "validating",
        total: 5000,
        valid: 0,
        warnings: 0,
        errors: 0,
        issues: {
          warnings: [],
          errors: [],
        },
      });

      // Simulate progress
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await delay(100); // 2 seconds total roughly
      }
      const hasError = false;
      const hasWarning = true;

      const result: ValidationResult = {
        status: hasError ? "error" : hasWarning ? "warning" : "success",
        total: 5000,
        // If error, some valid, some error. If warning, all valid but with warnings? Or count as valid records?
        // Usually valid records = processed successfully. Warnings are often processed-with-warning.
        valid: hasError ? 4800 : 5000,
        warnings: hasWarning ? 45 : 0,
        errors: hasError ? 200 : 0,
        issues: {
          warnings: [],
          errors: [],
        },
      };

      if (hasWarning) {
        result.issues.warnings = ["Row 45: Missing optional field 'comments'"];
      }
      if (hasError) {
        result.issues.errors = [
          "Row 80: Invalid date format",
          "Row 81: Duplicate ID",
        ];
      }

      setValidationResult(result);

      // Allow progress if no errors
      if (!hasError) {
        toggleComplete(item.id, true);
      } else {
        toggleComplete(item.id, false);
      }
    };

    runValidation();
  }, []);

  const isValidating =
    !validationResult ||
    validationResult.status === "validating" ||
    validationResult.status === "idle";

  const data = [
    {
      id: 1,
      name: "Total records",
      value: validationResult?.total,
    },
    {
      id: 2,
      name: "Valid records",
      value: validationResult?.valid,
    },
    {
      id: 3,
      name: "Warnings",
      value: validationResult?.warnings,
    },
    {
      id: 4,
      name: "Errors",
      value: validationResult?.errors,
    },
  ];

  return (
    <div className="size-full flex flex-col items-center justify-center">
      {isValidating ? (
        <div className="w-full max-w-103.5 space-y-0.5 m-auto">
          <div className="flex justify-between items-center gap-2">
            <p className="label-small text-foreground">Validating data</p>
            <span className="paragraph-x-small text-(--text--sub-600)">
              {progress}%
            </span>
          </div>
          <Progress
            value={progress}
            barClassName="bg-(--state--success--base)"
          />
          <p className={"paragraph-small text-(--text--sub-600)"}>
            Checking row {Math.floor((progress / 100) * 5000)} of 5000...
          </p>
          <p className="label-small text-(--text--sub-600) text-center mt-3">
            We are checking your file for duplicates, formatting errors and
            missing fields, this will take some few minutes
          </p>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-6">
          <div className="space-y-1">
            <h6 className="text-base font-bold text-foreground">
              Data Validation results
            </h6>
            <p className="text-sm text-(--text--sub-600)">
              Review the analysis of your data before proceeding to preview.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start gap-4 pt-8 w-full max-w-153 m-auto">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="rounded-full size-23 bg-(--state--success--lighter) shrink-0 grid place-items-center">
                <Icon
                  name="file-check-fill"
                  size={62}
                  className="text-(--state--success--base)"
                />
              </div>
              <h6 className="text-xl font-bold text-foreground">
                Validation successful
              </h6>
              <p className="paragraph-small text-(--text--sub-600)">
                Your CSV file has been validated successfully. Below is the
                summary
              </p>
            </div>

            <div className="bg-(--bg--weak-50) py-4.5 px-8 w-full grid grid-cols-4">
              {data.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm/5 border-l border-[#D5EDCD] pl-2.5 text-(--text--sub-600)",
                      item.id === 3 && "text-(--state--warning--base)",
                      item.id === 4 && "text-(--state--error--base)",
                    )}
                  >
                    {item.name}
                  </span>
                  <h5
                    className={cn(
                      "h5-title pl-2.5 text-(--text--sub-600)",
                      item.id === 3 && "text-(--state--warning--base)",
                      item.id === 4 && "text-(--state--error--base)",
                    )}
                  >
                    {item.value}
                  </h5>
                </div>
              ))}
            </div>

            {!!validationResult.warnings && (
              <div className="w-full flex items-start gap-3 py-4.5 px-4 bg-(--state--warning--lighter)">
                <Icon
                  name="error-warning-line"
                  size={24}
                  className="text-(--state--warning--base)"
                />
                <div className="flex-1 flex flex-col">
                  <span className="border-l border-[#D5EDCD] pl-2.5 text-(--text--sub-600) text-sm/5">
                    {validationResult.warnings} warning
                    {validationResult.warnings > 1 ? "s" : ""} found
                  </span>
                  <strong className="text-sm/5 font-semibold pl-2.5">
                    {validationResult.issues.warnings.join(", ")}
                  </strong>
                </div>
              </div>
            )}

            {!!validationResult.errors && (
              <div className="w-full flex items-start gap-3 py-4.5 px-4 bg-(--state--error--lighter)">
                <Icon
                  name="close-circle-fill"
                  size={24}
                  className="text-(--state--error--base)"
                />
                <div className="flex-1 flex flex-col">
                  <span className="border-l border-[#D5EDCD] pl-2.5 text-(--text--sub-600) text-sm/5">
                    {validationResult.errors} error
                    {validationResult.errors > 1 ? "s" : ""} found
                  </span>
                  <strong className="text-sm/5 font-semibold pl-2.5">
                    {validationResult.issues.errors.join(", ")}
                  </strong>
                </div>
              </div>
            )}

            {validationResult?.errors > 0 && (
              <Button
                variant="outline"
                className="gap-2 text-(--text--sub-600)"
              >
                <Icon
                  name="download-2-line"
                  size={20}
                  color="var(--icon--sub-600)"
                />
                Download failure report
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

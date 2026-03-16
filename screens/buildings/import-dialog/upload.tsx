"use client";
import { UploadComponent } from "@/components/upload";
import { useEffectEvent } from "react";
import { useSteps, ParsedSheet } from "./steps.context";
import { read, utils } from "xlsx";

export const Upload = () => {
  const { toggleComplete, item, setStep, setParsedSheets } = useSteps();
  const completionEvent = useEffectEvent(() => {
    toggleComplete(item.id, true);
  });

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: "array" });

        const sheets: ParsedSheet[] = workbook.SheetNames.map((name) => {
          const sheet = workbook.Sheets[name];
          // sheet_to_json with header:1 gives array-of-arrays
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rows: any[][] = utils.sheet_to_json(sheet, {
            header: 1,
            defval: null,
          });
          return { name, rows };
        });

        setParsedSheets(sheets);
        completionEvent();
        setStep((prev) => prev + 1);
      } catch (err) {
        console.error("Failed to parse Excel file:", err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex-1 size-full flex flex-col items-center justify-center gap-4 py-5">
      <div className="sapce-y-0.5 text-center max-w-70 text-foreground">
        <h6 className="h6-title">Upload Your Data File</h6>
        <p className="paragraph-small">
          Supported format : CSV, Excel (.xlsx, .xls)
        </p>
      </div>
      <UploadComponent onFileSelect={handleFileSelect} />
      <p className="paragraph-small text-foreground">
        Need a template?{" "}
        <a
          href="/import-template.xlsx"
          download="import-template.xlsx"
          className="text-(--state--information--base) underline cursor-pointer"
        >
          Download sample template
        </a>
      </p>
    </div>
  );
};

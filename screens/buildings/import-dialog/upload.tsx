"use client";
import { UploadComponent } from "@/components/upload";
import { useEffectEvent } from "react";
import { useSteps, ParsedSheet } from "./steps.context";
import ExcelJS from "exceljs";

export const Upload = () => {
  const { toggleComplete, item, setStep, setParsedSheets } = useSteps();
  const completionEvent = useEffectEvent(() => {
    toggleComplete(item.id, true);
  });

  const handleFileSelect = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const sheets: ParsedSheet[] = workbook.worksheets.map((worksheet) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        worksheet.eachRow({ includeEmpty: true }, (row) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const values = (row.values as any[]).slice(1); // index 0 is always null in exceljs
          rows.push(values.map((v) => (v === undefined ? null : v)));
        });
        return { name: worksheet.name, rows };
      });

      setParsedSheets(sheets);
      completionEvent();
      setStep((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to parse Excel file:", err);
    }
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

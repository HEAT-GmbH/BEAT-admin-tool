"use client";
import { UploadComponent } from "@/components/upload";
import { useEffectEvent } from "react";
import { useSteps } from "./steps.context";

export const Upload = () => {
  const { toggleComplete, item, setStep, setColumns } = useSteps();
  const completionEvent = useEffectEvent(() => {
    toggleComplete(item.id, true);
  });

  // Mock data generator
  const generateMockColumns = (): import("./steps.context").ImportColumn[] => [
    {
      id: "1",
      fileColumn: "Building_ID",
      requiredHeader: null,
      originalRequiredHeader: "building_identifer",
      type: "Text",
      status: "mismatch",
      sampleValue: "James Mornton Apartments",
    },
    {
      id: "2",
      fileColumn: "Climate",
      requiredHeader: "building_address",
      originalRequiredHeader: "building_address",
      type: "Text",
      status: "success",
      sampleValue: "Tropical",
    },
    {
      id: "3",
      fileColumn: "Location",
      requiredHeader: "region_state",
      originalRequiredHeader: "region_state",
      type: "Dropdown",
      status: "success",
      sampleValue: "1107 19th Street Northwest",
    },
    {
      id: "4",
      fileColumn: "Region",
      requiredHeader: "building_city",
      originalRequiredHeader: "building_city",
      type: "Dropdown",
      status: "success",
      sampleValue: "District of Columbia",
    },
    {
      id: "5",
      fileColumn: "City",
      requiredHeader: "country",
      originalRequiredHeader: "country",
      type: "Dropdown",
      status: "success",
      sampleValue: "Washington",
    },
    {
      id: "6",
      fileColumn: "Country of building",
      requiredHeader: "building_longitude",
      originalRequiredHeader: "building_longitude",
      type: "Text",
      status: "success",
      sampleValue: "United States of America",
    },
    {
      id: "7",
      fileColumn: "Longitude",
      requiredHeader: "building_latitude",
      originalRequiredHeader: "building_latitude",
      type: "Text",
      status: "success",
      sampleValue: "38.9037489",
    },
    {
      id: "8",
      fileColumn: "Latitude",
      requiredHeader: "building_type",
      originalRequiredHeader: "building_type",
      type: "Text",
      status: "success",
      sampleValue: "-77.0324977",
    },
    {
      id: "9",
      fileColumn: "Type of building",
      requiredHeader: "building_sub_type",
      originalRequiredHeader: "building_sub_type",
      type: "Dropdown",
      status: "success",
      sampleValue: "Apartments",
    },
    {
      id: "10",
      fileColumn: "Apartment type",
      requiredHeader: "apartment_type",
      originalRequiredHeader: "apartment_type",
      type: "Dropdown",
      status: "success",
      sampleValue: "Low income home",
    },
    {
      id: "11",
      fileColumn: "Assessment Period",
      requiredHeader: "no_of_years",
      originalRequiredHeader: "no_of_years",
      type: "Date",
      status: "success",
      sampleValue: "5",
    },
    {
      id: "12",
      fileColumn: "Construction year",
      requiredHeader: "contruction_year",
      originalRequiredHeader: "contruction_year",
      type: "Year",
      status: "success",
      sampleValue: "2014",
    },
    {
      id: "13",
      fileColumn: "Total floor area",
      requiredHeader: "floor_area",
      originalRequiredHeader: "floor_area",
      type: "Number",
      status: "success",
      sampleValue: "450",
    },
  ];

  const handleFileSelect = (file: File) => {
    // Simulate backend processing
    setTimeout(() => {
      setColumns(generateMockColumns());
      completionEvent();
      setStep((prev) => prev + 1);
    }, 1500);
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
          href="#"
          className="text-(--state--information--base) underline cursor-pointer"
        >
          Download sample template
        </a>
      </p>
    </div>
  );
};

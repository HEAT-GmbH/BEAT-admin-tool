"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AddBuildingForm, schema } from "../schema";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import FormRadioGroup from "@/components/form-radio-group";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";
import { AddBuildingContext } from "../context";
import { EditBuildingContext } from "@/screens/edit-building/context";
import { BuildingFileSection } from "@/components/building-file-section";

export function BuildingDetailsScreen() {
  const { control, setValue } = useFormContext<AddBuildingForm>();

  // Works in both add and edit flows
  const addCtx = useContext(AddBuildingContext);
  const editCtx = useContext(EditBuildingContext);
  const setCertFile = addCtx?.setCertFile ?? editCtx?.setCertFile ?? (() => {});
  const setBoqFiles = addCtx?.setBoqFiles ?? editCtx?.setBoqFiles ?? (() => {});
  const setSubtypesAvailable = addCtx?.setSubtypesAvailable ?? editCtx?.setSubtypesAvailable ?? (() => {});
  const buildingUuid = addCtx?.buildingUuid ?? editCtx?.buildingUuid ?? null;;

  const buildingTypeId = useWatch({
    control,
    name: "buildingInformation.buildingDetails.buildingTypeId",
  });

  const hasCertification = useWatch({
    control,
    name: "buildingInformation.buildingDetails.hasCertification",
  });

  const hasBoq = useWatch({
    control,
    name: "buildingInformation.buildingDetails.hasBOQ",
  });

  const { data: buildingTypesData, isLoading: isLoadingBuildingTypes } = useQuery({
    queryKey: ["building-types-list"],
    queryFn: () => apiService.getBuildingTypes({ currentPage: 1, pageSize: 200 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: climateTypesData, isLoading: isLoadingClimateTypes } = useQuery({
    queryKey: ["climate-types-list"],
    queryFn: () => apiService.getClimateTypes({ currentPage: 1, pageSize: 200 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: apartmentTypesData, isLoading: isLoadingApartmentTypes } = useQuery({
    queryKey: ["apartment-types", buildingTypeId],
    queryFn: () => apiService.getApartmentTypes(buildingTypeId!),
    enabled: !!buildingTypeId,
    staleTime: 5 * 60 * 1000,
  });

  const buildingTypes = (buildingTypesData?.data ?? []).map((bt) => ({
    item: bt.name,
    value: String(bt.id),
  }));

  const apartmentTypes = (apartmentTypesData ?? []).map((st) => ({
    item: st.name,
    value: String(st.id),
  }));

  const isFirstRender = useRef(true);
  // Clear apartment type whenever building type changes (but not on initial render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue("buildingInformation.buildingDetails.apartmentTypeId", undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingTypeId]);

  // Keep context informed about whether subtypes are available for the current building type
  useEffect(() => {
    setSubtypesAvailable(apartmentTypes.length > 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartmentTypes.length]);

  const climateTypes = (climateTypesData?.data ?? []).map((ct) => ({
    item: ct.name,
    value: ct.name,
  }));

  return (
    <section className="grid grid-cols-2 gap-x-4.5 gap-y-2.25">
      <FormSelect
        name="buildingInformation.buildingDetails.buildingTypeId"
        id="building-type"
        label="Building type"
        placeholder={isLoadingBuildingTypes ? "Loading..." : "Select building type"}
        control={control}
        schema={schema}
        items={buildingTypes}
        disabled={isLoadingBuildingTypes}
      />

      <FormSelect
        name="buildingInformation.buildingDetails.apartmentTypeId"
        id="apartment-type"
        label="Type of apartments"
        placeholder={
          !buildingTypeId
            ? "Select building type first"
            : isLoadingApartmentTypes
            ? "Loading..."
            : apartmentTypes.length === 0
            ? "No subtypes available"
            : "Select apartment type"
        }
        control={control}
        schema={schema}
        items={apartmentTypes}
        disabled={!buildingTypeId || isLoadingApartmentTypes || apartmentTypes.length === 0}
        fieldRequired={apartmentTypes.length > 0}
      />

      <div className="col-span-2">
        <FormSelect
          name="buildingInformation.buildingDetails.climateTypeId"
          id="area-climate-type"
          label="Area climate type"
          placeholder={isLoadingClimateTypes ? "Loading..." : "Select climate type"}
          control={control}
          schema={schema}
          items={climateTypes}
          disabled={isLoadingClimateTypes}
        />
      </div>

      <FormInput
        name="buildingInformation.buildingDetails.assessmentPeriod"
        id="assessment-period"
        label="Assessment period (years)"
        placeholder="eg. 10"
        type="number"
        control={control}
        schema={schema}
      />
      <FormInput
        name="buildingInformation.buildingDetails.constructionYear"
        id="construction-year"
        label="Construction year"
        placeholder="eg. 2023"
        control={control}
        schema={schema}
      />
      <FormInput
        name="buildingInformation.buildingDetails.totalFloorArea"
        id="total-floor-area"
        label="Total floor area"
        labelAddon={
          <span className="text-(--text--soft-400) text-xs">(m²)</span>
        }
        placeholder="eg. 340"
        type="number"
        control={control}
        schema={schema}
        endAddon={
          <span className="text-(--text--soft-400) text-sm font-normal">
            m²
          </span>
        }
      />
      <FormInput
        name="buildingInformation.buildingDetails.conditionedFloorArea"
        id="conditioned-floor-area"
        label="Conditioned floor area"
        labelAddon={
          <span className="text-(--text--soft-400) text-xs">(m²)</span>
        }
        placeholder="eg. 400"
        type="number"
        control={control}
        schema={schema}
        endAddon={
          <span className="text-(--text--soft-400) text-sm font-normal">
            m²
          </span>
        }
      />
      <FormInput
        name="buildingInformation.buildingDetails.numberOfFloorsBelowGround"
        id="number-of-floors-below-ground"
        label="Number of floors below ground"
        placeholder="eg. 3"
        type="number"
        control={control}
        schema={schema}
      />

      <FormRadioGroup
        name="buildingInformation.buildingDetails.hasCertification"
        id="has-certification"
        label="Has the building's certification process underway/been completed?"
        control={control}
        schema={schema}
        items={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />

      <FormRadioGroup
        name="buildingInformation.buildingDetails.hasBOQ"
        id="has-boq"
        label="Does the building have design drawings and Bill of Quantities (BoQ)?"
        control={control}
        schema={schema}
        items={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />

      {hasCertification === "yes" && (
        <div className="col-span-2">
          <BuildingFileSection
            label="Certification file"
            buildingUuid={buildingUuid}
            fileType="certification"
            multiple={false}
            onFilesChange={(files) => setCertFile(files[0] ?? null)}
          />
        </div>
      )}

      {hasBoq === "yes" && (
        <div className="col-span-2">
          <BuildingFileSection
            label="Design drawings / BoQ files"
            buildingUuid={buildingUuid}
            fileType="boq"
            multiple={true}
            onFilesChange={(files) => setBoqFiles(files)}
          />
        </div>
      )}
    </section>
  );
}

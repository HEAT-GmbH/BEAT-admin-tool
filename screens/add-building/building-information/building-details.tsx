"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AddBuildingForm, schema } from "../schema";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export function BuildingDetailsScreen() {
  const { control } = useFormContext<AddBuildingForm>();

  const buildingTypeId = useWatch({
    control,
    name: "buildingInformation.buildingDetails.buildingTypeId",
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

  const buildingTypes = (buildingTypesData?.data ?? []).map((bt) => ({
    item: bt.name,
    value: String(bt.id),
  }));

  const selectedBuildingType = (buildingTypesData?.data ?? []).find(
    (bt) => String(bt.id) === buildingTypeId,
  );

  const apartmentTypes = (selectedBuildingType?.subtypes ?? []).map((st) => ({
    item: st.name,
    value: String(st.id),
  }));


  const climateTypes = (climateTypesData?.data ?? []).map((ct) => ({
    item: ct.name,
    value: String(ct.id),
  }));

  return (
    <section className="grid grid-cols-2 gap-x-4.5 gap-y-2.25">
      <div className="col-span-2">
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
      </div>

      {apartmentTypes.length > 0 && (
        <div className="col-span-2">
          <FormSelect
            name="buildingInformation.buildingDetails.apartmentTypeId"
            id="apartment-type"
            label="Type of apartments"
            placeholder="Select apartment type"
            control={control}
            schema={schema}
            items={apartmentTypes}
          />
        </div>
      )}

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

      <FormSelect
        name="buildingInformation.buildingDetails.hasCertification"
        id="has-certification"
        label="Has the building's certification process underway/been completed?"
        placeholder="Select"
        control={control}
        schema={schema}
        items={[
          { item: "Yes", value: "yes" },
          { item: "No", value: "no" },
        ]}
      />

      <FormSelect
        name="buildingInformation.buildingDetails.hasBOQ"
        id="has-boq"
        label="Does the building have design drawings and Bill of Quantities (BoQ)?"
        placeholder="Select"
        control={control}
        schema={schema}
        items={[
          { item: "Yes", value: "yes" },
          { item: "No", value: "no" },
        ]}
      />
    </section>
  );
}

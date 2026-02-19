"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AddBuildingForm, schema } from "../../schema";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { countriesService } from "@/services/countries.service";
import { useEffect, useEffectEvent } from "react";
import { CircleFlag } from "react-circle-flags";
import { useQuery } from "@tanstack/react-query";

export function BuildingNameLocationScreen() {
  const { control, setValue } = useFormContext<AddBuildingForm>();

  const countries = countriesService.getCountries().map(({ code, name }) => ({
    item: (
      <div className="flex items-center gap-2">
        <CircleFlag countryCode={code} className="h-4 w-4" />
        <span>{name}</span>
      </div>
    ),
    value: code,
  }));

  const country = useWatch<AddBuildingForm>({
    control,
    name: "buildingInformation.buildingNameLocation.country",
  }) as string;

  const region = useWatch<AddBuildingForm>({
    control,
    name: "buildingInformation.buildingNameLocation.region",
  }) as string;

  const { data: states = [], isFetching: isLoadingStates } = useQuery({
    queryKey: ["states", country],
    queryFn: () => countriesService.getStates(country!),
    enabled: !!country,
  });

  const { data: cities = [], isFetching: isLoadingCities } = useQuery({
    queryKey: ["cities", country, region],
    queryFn: () => countriesService.getCities(country!, region!),
    enabled: !!country && !!region,
  });

  const countryEvent = useEffectEvent((c: string) => {
    if (c) {
      setValue("buildingInformation.buildingNameLocation.region", "");
      setValue("buildingInformation.buildingNameLocation.city", "");
    }
  });

  useEffect(() => {
    countryEvent(country);
  }, [country]);

  const regionEvent = useEffectEvent((r: string) => {
    if (r) {
      setValue("buildingInformation.buildingNameLocation.city", "");
    }
  });

  useEffect(() => {
    regionEvent(region);
  }, [region]);

  return (
    <section className="grid grid-cols-2 gap-y-4 gap-x-2.25">
      <div className="col-span-2">
        <FormInput
          name="buildingInformation.buildingNameLocation.nameOrCode"
          id="building-name-or-code"
          label="Building name or code"
          placeholder="eg. JP Plaza"
          control={control}
          schema={schema}
        />
      </div>
      <div className="col-span-2">
        <FormInput
          name="buildingInformation.buildingNameLocation.address"
          id="building-address"
          label="Address (Zip, Street)"
          placeholder="eg. 1885 L Street Northwest"
          control={control}
          schema={schema}
          labelAddon={
            <button
              type="button"
              className="text-(--text--sub-600) text-xs underline cursor-pointer"
            >
              Find location on map
            </button>
          }
        />
      </div>
      <FormSelect
        name="buildingInformation.buildingNameLocation.region"
        id="building-region"
        label="Region or State"
        placeholder={
          isLoadingStates ? "Loading states..." : "Select a region or state"
        }
        control={control}
        schema={schema}
        items={states.map((s) => ({ item: s.name, value: s.name }))}
        startIcon="flashlight-line"
        disabled={!country || isLoadingStates}
        hint={
          !country && (
            <div className="flex items-center gap-1.5 text-(--text--soft-400) text-xs">
              <Icon name="information-fill" size={14} />
              <span>Select a country first</span>
            </div>
          )
        }
      />
      <FormSelect
        name="buildingInformation.buildingNameLocation.city"
        id="building-city"
        label="City"
        placeholder={isLoadingCities ? "Loading cities..." : "Select a city"}
        control={control}
        schema={schema}
        items={cities.map((c) => ({ item: c.name, value: c.name }))}
        startIcon="flashlight-line"
        disabled={!region || isLoadingCities}
        hint={
          !region && (
            <div className="flex items-center gap-1.5 text-(--text--soft-400) text-xs">
              <Icon name="information-fill" size={14} />
              <span>Select a Region or state first</span>
            </div>
          )
        }
      />
      <div className="col-span-2">
        <FormSelect
          name="buildingInformation.buildingNameLocation.country"
          id="building-country"
          label="Country of building"
          placeholder="Select a country..."
          control={control}
          schema={schema}
          items={countries}
          startIcon="global-line"
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingNameLocation.longitude"
          id="building-longitude"
          label="Longitude (Optional)"
          placeholder="eg. 000000"
          control={control}
          schema={schema}
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingNameLocation.latitude"
          id="building-latitude"
          label="Latitude (Optional)"
          placeholder="eg. 000000"
          control={control}
          schema={schema}
        />
      </div>
    </section>
  );
}

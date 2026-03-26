"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AddBuildingForm, schema } from "../schema";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { apiService } from "@/services/api.service";
import { useEffect, useEffectEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function BuildingNameLocationScreen() {
  const { control, setValue } = useFormContext<AddBuildingForm>();
  const mounted = useIsMounted();

  const countryId = useWatch<AddBuildingForm>({
    control,
    name: "buildingInformation.buildingNameLocation.country",
  }) as string;

  const regionId = useWatch<AddBuildingForm>({
    control,
    name: "buildingInformation.buildingNameLocation.region",
  }) as string;

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries-list"],
    queryFn: () => apiService.getCountrySettings({ currentPage: 1, pageSize: 300 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: regions = [], isFetching: isLoadingRegions } = useQuery({
    queryKey: ["regions", countryId],
    queryFn: () => apiService.getCountryRegions(countryId),
    enabled: !!countryId,
  });

  const { data: cities = [], isFetching: isLoadingCities } = useQuery({
    queryKey: ["cities", countryId, regionId],
    queryFn: () => apiService.getCountryCities(countryId, { regionId }),
    enabled: !!countryId,
  });

  const countryEvent = useEffectEvent((c: string) => {
    if (mounted && c) {
      setValue("buildingInformation.buildingNameLocation.region", "");
      setValue("buildingInformation.buildingNameLocation.city", "");
    }
  });

  useEffect(() => {
    countryEvent(countryId);
  }, [countryId]);

  const regionEvent = useEffectEvent((r: string) => {
    if (mounted && r) {
      setValue("buildingInformation.buildingNameLocation.city", "");
    }
  });

  useEffect(() => {
    regionEvent(regionId);
  }, [regionId]);

  const countryItems = (countriesData?.data ?? []).map((c) => ({
    item: c.name,
    value: String(c.id),
  }));

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
      <div className="col-span-2">
        <FormSelect
          name="buildingInformation.buildingNameLocation.country"
          id="building-country"
          label="Country of building"
          placeholder={isLoadingCountries ? "Loading..." : "Select a country"}
          control={control}
          schema={schema}
          items={countryItems}
          startIcon="global-line"
          disabled={isLoadingCountries}
        />
      </div>
      <FormSelect
        name="buildingInformation.buildingNameLocation.region"
        id="building-region"
        label="Region or State"
        placeholder={
          isLoadingRegions ? "Loading regions..." : "Select a region or state"
        }
        control={control}
        schema={schema}
        items={regions.map((r) => ({ item: r.name, value: String(r.id) }))}
        startIcon="flashlight-line"
        disabled={!countryId || isLoadingRegions}
        hint={
          !countryId && (
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
        items={cities.map((c) => ({ item: c.name, value: String(c.id) }))}
        startIcon="flashlight-line"
        disabled={!countryId || isLoadingCities}
        hint={
          !countryId && (
            <div className="flex items-center gap-1.5 text-(--text--soft-400) text-xs">
              <Icon name="information-fill" size={14} />
              <span>Select a country first</span>
            </div>
          )
        }
      />
      <FormInput
        name="buildingInformation.buildingNameLocation.longitude"
        id="building-longitude"
        label="Longitude (Optional)"
        placeholder="eg. 000000"
        control={control}
        schema={schema}
      />
      <FormInput
        name="buildingInformation.buildingNameLocation.latitude"
        id="building-latitude"
        label="Latitude (Optional)"
        placeholder="eg. 000000"
        control={control}
        schema={schema}
      />
    </section>
  );
}

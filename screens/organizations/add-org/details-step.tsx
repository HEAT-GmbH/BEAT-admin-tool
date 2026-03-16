"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AddOrgData, orgDetailsSchema } from "../schema";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const DetailsStep = () => {
  const { control } = useFormContext<AddOrgData>();

  const countryId = useWatch({
    control,
    name: "details.country",
  });

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["org-countries"],
    queryFn: () => apiService.getCountrySettings({ currentPage: 1, pageSize: 300 }),
  });

  const { data: cities = [], isFetching: isLoadingCities } = useQuery({
    queryKey: ["org-cities", countryId],
    queryFn: () => apiService.getCountryCities(countryId, {}),
    enabled: !!countryId,
  });

  const countryItems = (countriesData?.data ?? []).map((c) => ({
    item: c.name,
    value: String(c.id),
  }));

  return (
    <div className="space-y-4 pt-4">
      <FormInput
        name="details.name"
        id="org-name"
        label="Organization name"
        placeholder="eg. Big Corp Int."
        fieldRequired
        control={control}
        schema={orgDetailsSchema}
      />

      <FormSelect
        name="details.industry"
        id="org-industry"
        label="Industry"
        placeholder="Select an industry"
        control={control}
        schema={orgDetailsSchema}
        items={[
          { value: "construction", item: "Construction" },
          { value: "manufacturing", item: "Manufacturing" },
          { value: "technology", item: "Technology" },
          { value: "finance", item: "Finance" },
          { value: "healthcare", item: "Healthcare" },
          { value: "education", item: "Education" },
          { value: "real_estate", item: "Real Estate" },
          { value: "energy", item: "Energy" },
          { value: "retail", item: "Retail" },
          { value: "other", item: "Other" },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          name="details.country"
          id="org-country"
          label="Country of operation"
          placeholder={isLoadingCountries ? "Loading..." : "Select home country"}
          control={control}
          schema={orgDetailsSchema}
          items={countryItems}
          disabled={isLoadingCountries}
        />
        <FormSelect
          name="details.city"
          id="org-city"
          label="Organization's city"
          placeholder={isLoadingCities ? "Loading..." : "Select city"}
          control={control}
          schema={orgDetailsSchema}
          items={cities.map((c) => ({ item: c.name, value: String(c.id) }))}
          disabled={!countryId || isLoadingCities}
        />
      </div>
    </div>
  );
};
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AddOrgData, orgDetailsSchema } from "../schema";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { countriesService } from "@/services/countries.service";
import { CircleFlag } from "react-circle-flags";
import { useQuery } from "@tanstack/react-query";

export const DetailsStep = () => {
  const { control } = useFormContext<AddOrgData>();

  const country = useWatch({
    control,
    name: "details.country",
  });

  const { data: cities = [], isFetching: isLoadingCities } = useQuery({
    queryKey: ["cities", country],
    queryFn: () => countriesService.getCities(country, ""), // Get all cities for country
    enabled: !!country,
  });

  const countries = countriesService.getCountries().map(({ code, name }) => ({
    item: (
      <div className="flex items-center gap-2">
        <CircleFlag countryCode={code.toLowerCase()} className="h-4 w-4" />
        <span>{name}</span>
      </div>
    ),
    value: code,
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
          { value: "Construction", item: "Construction" },
          { value: "Manufacturing", item: "Manufacturing" },
          { value: "Technology", item: "Technology" },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          name="details.country"
          id="org-country"
          label="Country of operation"
          placeholder="Select home country"
          control={control}
          schema={orgDetailsSchema}
          items={countries}
        />
        <FormSelect
          name="details.city"
          id="org-city"
          label="Organization's city"
          placeholder={isLoadingCities ? "Loading..." : "Select city"}
          control={control}
          schema={orgDetailsSchema}
          items={cities.map((c) => ({ item: c.name, value: c.name }))}
          disabled={!country || isLoadingCities}
        />
      </div>
    </div>
  );
};

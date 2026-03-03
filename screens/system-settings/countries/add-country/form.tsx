"use client";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { countriesService } from "@/services/countries.service";
import { useState } from "react";
import { CircleFlag } from "react-circle-flags";
import { useFormContext, useWatch } from "react-hook-form";
import { AddCountryData } from "./schema";

export const FormContent = () => {
  const {
    setValue,
    formState: { errors },
    control,
  } = useFormContext<AddCountryData>();
  const [cityInput, setCityInput] = useState("");

  const country = useWatch({ name: "country", control });
  const cities = useWatch({ name: "cities", control }) || [];

  const handleAddCity = () => {
    if (!cityInput.trim()) return;
    const trimmed = cityInput.trim();
    if (!cities.includes(trimmed)) {
      setValue("cities", [...cities, trimmed], { shouldValidate: true });
    }
    setCityInput("");
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setValue(
      "cities",
      cities.filter((c) => c !== cityToRemove),
      { shouldValidate: true },
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <Label className="text-(--text--strong-950) font-medium">
          Country <span className="text-red-500">*</span>
        </Label>
        <VirtualizedCombobox
          options={[
            {
              value: "",
              label: "Select a country",
              icon: <Icon name="global-line" />,
            },
            ...countriesService.getCountries().map(({ code, name }) => ({
              value: code,
              label: name,
              icon: <CircleFlag countryCode={code} className="h-4 w-4" />,
            })),
          ]}
          value={country}
          onValueChange={(val) => {
            console.log(val);
            setValue("country", val || "", { shouldValidate: true });
          }}
          placeholder="Select country"
          searchPlaceholder="Search country..."
          className="w-full h-10 justify-start gap-2"
        />
        {errors.country && (
          <span className="text-xs text-red-500">{errors.country.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label className="text-(--text--strong-950) font-bold">Cities</Label>
          <span className="text-sm text-(--text--sub-600)">
            Add cities to the selected country.
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-(--text--strong-950) font-medium">
            Name of city <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter name of city here and click the add button"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCity();
                }
              }}
              className="flex-1 h-10"
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 px-4"
              onClick={handleAddCity}
            >
              <Icon name="add-large-fill" className="h-4 w-4 mr-2" /> Add city
            </Button>
          </div>
          {errors.cities && (
            <span className="text-xs text-red-500">
              {errors.cities.message}
            </span>
          )}
        </div>

        {cities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {cities.map((city) => (
              <Badge
                key={city}
                variant="secondary"
                className="h-8 pl-3 pr-1 py-1 rounded-md bg-(--bg--soft-200) text-(--text--main-900) font-normal gap-1 flex items-center hover:bg-(--bg--soft-200)"
              >
                {city}
                <button
                  type="button"
                  onClick={() => handleRemoveCity(city)}
                  className="rounded-full h-5 w-5 hover:bg-black/10 flex items-center justify-center text-(--icon--sub-600)"
                >
                  <Icon name="close-line" size={20} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

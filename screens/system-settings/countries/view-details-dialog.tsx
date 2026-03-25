"use client";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CountrySetting } from "@/models/country-setting";
import { SSDialog } from "@/screens/components/dialog";
import { countriesService } from "@/services/countries.service";
import { useEffect, useState } from "react";
import { CircleFlag } from "react-circle-flags";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CountrySetting | null;
}

export const ViewDetailsDialog = ({ open, onOpenChange, item }: Props) => {
  const [cityInput, setCityInput] = useState("");
  const [localItem, setLocalItem] = useState<CountrySetting | null>(null);
  const [isEditCity, setIsEditCity] = useState(-1);
  const [editCityInput, setEditCityInput] = useState("");

  const isNewCity = (cityName: string) => {
    return item ? !item?.cities.find((c) => c.name === cityName) : false;
  };

  const completeEditCity = () => {
    if (isEditCity === -1) return;
    setLocalItem((prev) => {
      if (!prev) return null;
      const newCities = [...prev.cities];
      newCities[isEditCity] = { ...newCities[isEditCity], name: editCityInput };
      return { ...prev, cities: newCities };
    });
    setIsEditCity(-1);
    setEditCityInput("");
  };

  const countryCode = localItem
    ? countriesService.getCountryCodeByName(localItem.name)
    : "";

  const handleAddCity = () => {
    if (!cityInput.trim()) return;
    const trimmed = cityInput.trim();
    if (!localItem?.cities.some((c) => c.name === trimmed)) {
      setLocalItem((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cities: [{ name: trimmed, isActive: true }, ...prev.cities],
          citiesCount: prev.cities.length + 1,
        };
      });
    }
    setCityInput("");
  };

  useEffect(() => {
    if (item && open) {
      setLocalItem({ ...item });
    }
  }, [item, open]);

  if (!localItem) return null;

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${localItem.name} & Cities`}
      description="Manage country and cities"
      onSubmit={() => onOpenChange(false)}
      nextLabel="Continue"
    >
      <div className="flex-1 overflow-y-auto w-full flex flex-col p-6 gap-6">
        <div className="flex items-center justify-between gap-2 p-2.5 bg-muted rounded-[0.5rem] border border-border">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              {countryCode && (
                <CircleFlag countryCode={countryCode} className="size-6" />
              )}
              <span className="label-small font-medium">{localItem.name}</span>
            </div>
            <span className="text-sm text-(--text--sub-600) ml-7.5">
              No. of cities : {localItem.cities.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-(--text--strong-950)">
              {localItem.status}
            </span>
            <Switch
              checked={localItem.status === "Active"}
              onCheckedChange={(c) =>
                setLocalItem((prev) => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    status: c ? "Active" : "Inactive",
                  };
                })
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-base text-(--text--strong-950)">
              Cities
            </h3>
            <p className="text-sm text-(--text--sub-600)">Added cities</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-(--text--strong-950) font-bold">
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
                className="h-10 px-4 text-(--text--main-900)"
                onClick={handleAddCity}
              >
                <Icon name="add-large-fill" className="h-4 w-4 mr-2" /> Add city
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {localItem.cities.map((city, index) => (
              <div
                key={city.name}
                className="flex items-center justify-between pb-2.5 border-b border-border"
              >
                <div className="flex items-center gap-2">
                  {isEditCity !== index ? (
                    <>
                      <Badge className="label-small font-medium py-1 px-2 bg-muted h-7 rounded-[0.375rem]">
                        {city.name}
                      </Badge>
                      {isNewCity(city.name) && (
                        <Badge className="label-x-small font-medium py-1 px-2 bg-(--state--success--lighter) text-(--state--success--base) h-7 rounded-[0.375rem]">
                          <div className="bg-(--state--success--base) rounded-full size-1.5" />
                          New
                        </Badge>
                      )}
                    </>
                  ) : (
                    <>
                      <Input
                        placeholder="Enter name of city here and click the add button"
                        value={editCityInput}
                        onChange={(e) => setEditCityInput(e.target.value)}
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
                        variant="secondary"
                        className="h-10 px-4 text-(--text--main-900)"
                        onClick={completeEditCity}
                      >
                        Done
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={city.isActive}
                      onCheckedChange={(isActive) => {
                        setLocalItem((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            cities: prev.cities.map((c) =>
                              c.name === city.name ? { ...c, isActive } : c,
                            ),
                          };
                        });
                      }}
                    />
                    <span className="text-sm font-medium text-(--text--strong-950)">
                      {city.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-(--icon--sub-600)"
                    onClick={() => {
                      if (isEditCity !== -1) {
                        completeEditCity();
                      }
                      setIsEditCity(index);
                      setEditCityInput(city.name);
                    }}
                  >
                    <Icon name="edit-fill" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SSDialog>
  );
};

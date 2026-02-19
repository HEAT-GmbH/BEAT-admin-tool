"use client";

import { InputWithIcon } from "@/components/input-with-icon";
import { Loader } from "@/components/loader";
import { FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useDebounce from "@/hooks/use-debounce";
import { apiService } from "@/services/api.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  onOrganizationSelect: (organization: { id: string; name: string }) => void;
}

export const Organizations = ({ onOrganizationSelect }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue);
  const { data, isFetching } = useQuery({
    queryKey: ["organizations", debouncedSearchValue],
    queryFn: () => apiService.fetchOrganizations(debouncedSearchValue),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-2.5 w-full">
      <InputWithIcon
        placeholder="Search organizations name here"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        startIcon="search-2-line"
        groupClassName="sticky top-0 mt-2 z-2"
      />
      {!!isFetching && (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      )}
      {!!data && (
        <RadioGroup
          className="grid grid-cols-1 gap-2"
          onValueChange={onOrganizationSelect}
        >
          {data.map((organization) => (
            <FieldLabel
              key={organization.id}
              htmlFor={organization.id}
              className="py-4 px-2.5 flex items-center justify-between gap-3 text-(--static--static-black) rounded-[0.5rem] border border-(--bg--weak-50) w-full cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-full size-5 bg-(--neutral--gray--200) grid place-items-center shrink-0 label-x-small text-(--text--strong-950)">
                  {organization.name.charAt(0).toUpperCase()}
                </div>
                <span className="label-small">{organization.name}</span>
              </div>
              <RadioGroupItem value={organization} id={organization.id} />
            </FieldLabel>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

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
  onOrganizationSelect: (item: { id: string; name: string }) => void;
}

export const Users = ({ onOrganizationSelect }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue);
  const { data, isFetching } = useQuery({
    queryKey: ["users-import-list", debouncedSearchValue],
    queryFn: () =>
      apiService.getUsers({
        search: debouncedSearchValue || undefined,
        page: 1,
        pageSize: 100,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-2.5 w-full">
      <InputWithIcon
        placeholder="Search users here"
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
          {data.data.map((user) => (
            <FieldLabel
              key={user.id}
              htmlFor={user.id}
              className="py-4 px-2.5 flex items-center justify-between gap-3 text-(--static--static-black) rounded-[0.5rem] border border-(--bg--weak-50) w-full cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-full size-5 bg-(--neutral--gray--200) grid place-items-center shrink-0 label-x-small text-(--text--strong-950)">
                  {(user.full_name || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="label-small">
                    {user.full_name || user.email}
                  </span>
                  {user.full_name && (
                    <span className="text-xs text-(--text--sub-600)">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
              <RadioGroupItem
                value={{ id: user.id, name: user.full_name || user.email }}
                id={user.id}
              />
            </FieldLabel>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

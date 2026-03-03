"use client";
import { InputWithIcon } from "@/components/input-with-icon";

interface Props {
  setSearchValue: (value: string) => void;
}

export const SSSearchBar = ({ setSearchValue }: Props) => {
  return (
    <div className="w-full">
      <InputWithIcon
        startIcon="search-2-line"
        placeholder="Search..."
        groupClassName="h-10 max-w-none w-full bg-white"
        className="pl-10"
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

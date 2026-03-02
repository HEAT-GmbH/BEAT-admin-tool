"use client";

import { AdvancedSearch } from "@/components/advanced-search";
import { useOperationalDataEntryContext } from "./operational-data-entry.context";
import { operationalDataEntrySearchSchema } from "./schema";

export const SearchControl = () => {
  const { onSearch, isFetching } = useOperationalDataEntryContext();
  return (
    <AdvancedSearch
      schema={operationalDataEntrySearchSchema}
      items={[
        {
          name: "category",
          options: [],
          placeholder: "Category",
        },
        {
          name: "subCategory",
          options: [],
          placeholder: "Sub Category",
        },
        {
          name: "childCategory",
          options: [],
          placeholder: "Child Category",
        },
        {
          name: "epdType",
          options: [],
          placeholder: "EPD Type",
        },
      ]}
      disabled={isFetching}
      onSubmit={onSearch}
    />
  );
};

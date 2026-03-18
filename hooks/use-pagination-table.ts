"use client"

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import useDebounce from './use-debounce'

interface Props<T> {
  queryKey: string;
  pageSize?: number;
  queryFn: (params: {search: string, currentPage: number, pageSize: number}) => Promise<{data: T[], currentPage: number, totalItems: number} | null>;
}

export const usePaginationTable = <T>({queryKey, queryFn, pageSize = 10}: Props<T>) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, debouncedSearchValue, currentPage],
    queryFn: () =>
      queryFn({
        search: debouncedSearchValue,
        currentPage,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const items = data?.data || null;
  const totalPages = data ? Math.ceil(data.totalItems / pageSize) : 0;

  const onNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const onPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return {
    searchValue,
    setSearchValue,
    items,
    isLoading,
    isFetching,
    currentPage,
    setCurrentPage,
    totalPages,
    onNextPage,
    onPreviousPage,
  }
}

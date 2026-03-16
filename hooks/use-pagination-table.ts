"use client"

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import useDebounce from './use-debounce'

interface Props<T> {
  queryKey: string;
  pageSize: number;
  queryFn: (params: { search: string, currentPage: number, pageSize: number }) => Promise<{ data: T[], currentPage: number, totalItems: number } | null>;
}

export const usePaginationTable = <T>({ queryKey, queryFn, pageSize }: Props<T>) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchValue = searchParams.get("search") ?? ""
  const currentPage = Number(searchParams.get("page") ?? "1")

  const debouncedSearchValue = useDebounce(searchValue, 500)

  const updateParams = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const setSearchValue = useCallback((value: string) => {
    updateParams({ search: value || undefined, page: undefined })
  }, [updateParams])

  const setCurrentPage = useCallback((page: number) => {
    updateParams({ page: page === 1 ? undefined : String(page) })
  }, [updateParams])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, debouncedSearchValue, currentPage],
    queryFn: () =>
      queryFn({
        search: debouncedSearchValue,
        currentPage,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  })

  const items = data?.data || null
  const totalPages = data ? Math.ceil(data.totalItems / pageSize) : 0

  const onNextPage = () => setCurrentPage(currentPage + 1)
  const onPreviousPage = () => setCurrentPage(currentPage - 1)

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
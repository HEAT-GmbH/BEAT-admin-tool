export interface PaginationTableContextType<T> {
  searchValue: string;
  setSearchValue: (value: string) => void;
  items: T[] | null;
  isLoading: boolean;
  isFetching: boolean;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}
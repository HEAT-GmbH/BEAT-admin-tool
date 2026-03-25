import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  onNextPage,
  onPreviousPage,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const renderPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            isActive={currentPage === page}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(page);
            }}
            className="cursor-pointer"
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    let start = currentPage === 1 ? 1 : currentPage - 1;
    if (start > totalPages - 3) {
      start = totalPages - 3;
    }

    const initialPages = [start, start + 1, start + 2];
    const showEllipsis = initialPages[2] < totalPages - 1;

    return (
      <>
        {initialPages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={currentPage === page}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(page);
              }}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {showEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {initialPages[2] < totalPages && (
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(totalPages);
              }}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
      </>
    );
  };

  return (
    <ShadcnPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPreviousPage();
            }}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onNextPage();
            }}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
};

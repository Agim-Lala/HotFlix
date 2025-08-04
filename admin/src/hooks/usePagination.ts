import { useState } from "react";

type Pagination = {
  page: number;
  pageSize: number;
  totalCount: number;
};

interface PaginationState {
  pagination: Pagination;
  onTotalCountChange: (count: number) => void;
  onPageChange: (page: number) => void;
}

export function usePagination(initialPageSize = 10): PaginationState {
  const [pagination, setPagination] = useState<Pagination>(() => ({
    page: 1,
    totalCount: 0,
    pageSize: initialPageSize,
  }));

  const onPageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const onTotalCountChange = (totalCount: number) => {
    setPagination((prev) => ({ ...prev, totalCount }));
  };

  return {
    pagination,
    onTotalCountChange,
    onPageChange,
  };
}

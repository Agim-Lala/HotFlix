import { useState, useCallback, useEffect } from "react";
import { Input, message, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import {
  deleteMovieById,
  fetchMovies,
  SortFields,
  toggleMovieStatus,
} from "../../api/movieApi";
import styles from "./catalog.module.css";
import useQuery from "../../hooks/useQuery";
import { usePagination } from "../../hooks/usePagination";
import { MovieTable } from "./MovieTable";
import { useSearchParams } from "react-router-dom";

const sortOptions = Object.values(SortFields);

const Movies = () => {
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.CreatedAt
  );
  const [ascending, setAscending] = useState(false);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sortParam = searchParams.get("sortBy") as SortFields | null;
    if (
      sortParam &&
      Object.values(SortFields).includes(sortParam as SortFields)
    ) {
      setSelectedSort(sortParam as SortFields);
    }

    const pageParam = searchParams.get("page");
    if (pageParam) {
      onPageChange(Number(pageParam));
    }
  }, [searchParams]);

  const { pagination, onPageChange, onTotalCountChange } = usePagination(10);

  const fetchResponse = useCallback(
    () =>
      fetchMovies({
        sortBy: selectedSort,
        ascending,
        page: pagination.page,
        pageSize: pagination.pageSize,
        filters: search ? { movieQuery: search } : undefined,
      }),
    [selectedSort, ascending, pagination.page, pagination.pageSize, search]
  );
  const handleToggleStatus = async (id: number) => {
    try {
      await toggleMovieStatus(id);
      message.success(`Movie with ID: ${id} status changed`);
      refetch();
    } catch (error) {
      console.error(error);
      message.error("Failed to toggle movie visibility.");
    }
  };

  const handleDelete = async (movieId: number) => {
    try {
      await deleteMovieById(movieId);
      message.success(`Movie with ID: ${movieId} deleted`);
      refetch();
    } catch {
      message.error("Failed to delete movie");
    }
  };

  const {
    query: { status, response },
    refetch,
  } = useQuery(fetchResponse);

  useEffect(() => {
    if (response?.totalCount) {
      onTotalCountChange(response.totalCount);
    }
  }, [response]);

  return (
    <SidebarLayout>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>
            Movies
            <span className={styles.movieCount}>
              {response?.totalCount} Total
            </span>
          </div>
        </div>

        <Space align="end" size="middle">
          <div>
            <div className={styles.sortLabel}>Sort by:</div>
            <Select
              value={selectedSort}
              onSelect={(value) => {
                if (value === selectedSort) {
                  setAscending((prev) => !prev);
                } else {
                  setSelectedSort(value);
                  setAscending(false);
                }
                onPageChange(1);
              }}
              className={styles.select}
              variant="borderless"
              options={sortOptions.map((item) => ({
                value: item,
                label: (
                  <span>
                    {item}
                    {selectedSort === item && (
                      <span style={{ marginLeft: 4 }}>
                        {ascending ? "↑" : "↓"}
                      </span>
                    )}
                  </span>
                ),
              }))}
            />
          </div>

          <Input
            className={styles.input}
            placeholder="Find Movie/Tv series ..."
            suffix={<SearchOutlined />}
            variant="borderless"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => onPageChange(1)}
            allowClear
          />
        </Space>
      </div>

      <div className={styles.body}>
        <MovieTable
          movies={response?.movies ?? []}
          loading={status === "loading"}
          currentPage={pagination.page}
          totalCount={pagination.totalCount}
          onPageChange={onPageChange}
          onToggleStatus={handleToggleStatus}
          handleDelete={handleDelete}
        />
      </div>
    </SidebarLayout>
  );
};

export default Movies;

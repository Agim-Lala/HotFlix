import { useState, useCallback, useEffect } from "react";
import { Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import { fetchMovies, SortFields } from "../../api/movieApi";
import styles from "./catalog.module.css";
import useQuery from "../../hooks/useQuery";
import { usePagination } from "../../hooks/usePagination";
import { MovieTable } from "./MovieTable";

const sortOptions = Object.values(SortFields);

const Movies = () => {
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.CreatedAt
  );

  const { pagination, onPageChange, onTotalCountChange } = usePagination(10);

  const fetchResponse = useCallback(
    () =>
      fetchMovies({
        sortBy: selectedSort,
        ascending: true,
        page: pagination.page,
        pageSize: pagination.pageSize,
      }),
    [selectedSort, pagination.page, pagination.pageSize]
  );

  const {
    query: { status, response },
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
              onChange={(value) => {
                setSelectedSort(value);
                onPageChange(1);
              }}
              className={styles.select}
              variant="borderless"
              options={sortOptions.map((item) => ({
                value: item,
                label: <span>{item}</span>,
              }))}
            />
          </div>

          <Input
            className={styles.input}
            placeholder="Find Movie/Tv series ..."
            suffix={<SearchOutlined />}
            variant="borderless"
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
        />
      </div>
    </SidebarLayout>
  );
};

export default Movies;

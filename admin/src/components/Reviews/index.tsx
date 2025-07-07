import { useState, useCallback, useEffect } from "react";
import { Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import { fetchReviews, SortFields } from "../../api/reviewApi";
import styles from "./reviews.module.css";
import useQuery from "../../hooks/useQuery";
import { ReviewTable } from "./ReviewTable";
import { usePagination } from "../../hooks/usePagination";

const sortOptions = Object.values(SortFields);

const Reviews = () => {
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.CreatedAt
  );
  const { pagination, onTotalCountChange, onPageChange } = usePagination(10);

  const fetchResponse = useCallback(
    () =>
      fetchReviews({
        sortBy: selectedSort,
        ascending: true,
        page: 1,
        pageSize: 10,
      }),
    [selectedSort]
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
            Reviews
            <span className={styles.reviewCount}>
              {response?.totalCount} Total
            </span>
          </div>
        </div>

        <Space align="end" size="middle">
          <div>
            <div className={styles.sortLabel}>Sort by:</div>
            <Select
              value={selectedSort}
              onChange={(value) => setSelectedSort(value)}
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
            placeholder="Key word ..."
            suffix={<SearchOutlined />}
            variant="borderless"
          />
        </Space>
      </div>

      <div className={styles.body}>
        <ReviewTable
          reviews={response?.reviews ?? []}
          loading={status === "loading"}
          currentPage={pagination.page}
          totalCount={pagination.totalCount}
          onPageChange={onPageChange}
        />
      </div>
    </SidebarLayout>
  );
};

export default Reviews;

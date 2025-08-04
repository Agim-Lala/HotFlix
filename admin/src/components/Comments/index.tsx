import { useState, useCallback, useEffect } from "react";
import { Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import { fetchComments, SortFields } from "../../api/commentApi";
import styles from "./comments.module.css";
import useQuery from "../../hooks/useQuery";
import { usePagination } from "../../hooks/usePagination";
import { CommentTable } from "./CommentsTable";

const sortOptions = Object.values(SortFields);

const Comments = () => {
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.CreatedAt
  );

  const { pagination, onTotalCountChange, onPageChange } = usePagination(10);

  const fetchResponse = useCallback(
    () =>
      fetchComments({
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
            Comments
            <span className={styles.commentCount}>
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
        <CommentTable
          comments={response?.comments ?? []}
          loading={status === "loading"}
          currentPage={pagination.page}
          totalCount={pagination.totalCount}
          onPageChange={onPageChange}
        />
      </div>
    </SidebarLayout>
  );
};

export default Comments;

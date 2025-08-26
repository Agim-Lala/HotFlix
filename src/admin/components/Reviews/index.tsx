import { useState, useCallback, useEffect } from "react";
import { Input, message, Modal, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import { fetchReviews, SortFields, DeleteReview } from "../../api/reviewApi";
import styles from "./reviews.module.css";
import useQuery from "../../hooks/useQuery";
import { ReviewTable } from "./ReviewTable";
import { usePagination } from "../../hooks/usePagination";
import ReviewDrawer from "./ReviewDrawer";

const sortOptions = Object.values(SortFields);

const Reviews = () => {
  const [Message] = message.useMessage();
  const [ascending, setAscending] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.CreatedAt
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const { pagination, onTotalCountChange, onPageChange } = usePagination(10);

  const fetchResponse = useCallback(
    () =>
      fetchReviews({
        sortBy: selectedSort,
        ascending,
        page: 1,
        pageSize: 10,
        filters: search ? { query: search } : undefined,
      }),
    [selectedSort, ascending, pagination.page, pagination.pageSize, search]
  );

  const {
    query: { status, response },
    refetch,
  } = useQuery(fetchResponse);

  useEffect(() => {
    if (response?.totalCount) {
      onTotalCountChange(response.totalCount);
    }
  }, [response]);

  const handleDelete = async (reviewId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this review?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          await DeleteReview(reviewId);
          Message.success("Review deleted successfully");
          refetch();
        } catch (error) {
          Message.error("Failed to delete review");
        }
      },
    });
  };

  const handleView = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setDrawerOpen(true);
  };

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
            placeholder="Key word ..."
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
        <ReviewTable
          reviews={response?.reviews ?? []}
          loading={status === "loading"}
          currentPage={pagination.page}
          totalCount={pagination.totalCount}
          onPageChange={onPageChange}
          onDelete={handleDelete}
          onView={handleView}
        />

        <ReviewDrawer
          open={drawerOpen}
          reviewId={selectedReviewId}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </SidebarLayout>
  );
};

export default Reviews;

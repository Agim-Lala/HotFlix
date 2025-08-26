import { useState, useCallback, useEffect } from "react";
import { Input, Select, Space, Modal, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import {
  fetchComments,
  SortFields,
  adminDeleteComment,
} from "../../api/commentApi";
import styles from "./comments.module.css";
import useQuery from "../../hooks/useQuery";
import { usePagination } from "../../hooks/usePagination";
import { CommentTable } from "./CommentsTable";
import CommentViewDrawer from "./CommentViewDrawer";

const sortOptions = Object.values(SortFields);

const Comments = () => {
  const [ascending, setAscending] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.createdAt
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null
  );
  const { pagination, onTotalCountChange, onPageChange } = usePagination(10);

  const fetchResponse = useCallback(
    () =>
      fetchComments({
        sortBy: selectedSort,
        ascending,
        page: pagination.page,
        pageSize: pagination.pageSize,
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

  const handleDelete = async (commentId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this comment?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          await adminDeleteComment(commentId);
          message.success("Comment deleted successfully");
          refetch();
        } catch (error) {
          message.error("Failed to delete comment");
        }
      },
    });
  };
  const handleView = (commentId: number) => {
    setSelectedCommentId(commentId);
    setDrawerOpen(true);
  };

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
            placeholder="Find Comments ..."
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
        <CommentTable
          comments={response?.comments ?? []}
          loading={status === "loading"}
          currentPage={pagination.page}
          totalCount={pagination.totalCount}
          onPageChange={onPageChange}
          onDelete={handleDelete}
          onView={handleView}
        />
        <CommentViewDrawer
          open={drawerOpen}
          commentId={selectedCommentId}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </SidebarLayout>
  );
};

export default Comments;

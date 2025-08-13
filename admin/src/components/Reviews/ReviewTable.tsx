import { Table, Space, Button, Tooltip } from "antd";
import { DeleteOutlined, StarFilled, EditOutlined } from "@ant-design/icons";
import { Review } from "../../api/reviewApi";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./ReviewTable.module.css";

interface ReviewTableProps {
  reviews: Review[];
  loading: boolean;
  currentPage?: number;
  totalCount?: number;
  initialPageSize?: number;
  onPageChange?: (page: number) => void;
  onDelete: (reviewId: number) => void;
}

const getReviewTableColumns = (
  _navigate: ReturnType<typeof useNavigate>,
  onDelete: (reviewId: number) => void
): ColumnsType<Review> => [
  {
    title: "ID",
    dataIndex: "reviewId",
    key: "reviewId",
  },
  {
    title: "Item",
    dataIndex: "movieTitle",
    key: "item",
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Text",
    dataIndex: "text",
    key: "text",
  },
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    render: (rating: number) => (
      <span style={{ color: "#ffcc00" }}>
        <StarFilled /> {rating}
      </span>
    ),
  },
  {
    title: "Like/Dislike",
    dataIndex: "likeDislike",
    key: "likeDislike",
    render: (value: string | undefined) => value || "0/0",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => (
      <span className={styles.createdAt}>
        {dayjs(date).format("DD MMM YYYY")}
      </span>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_text, record) => (
      <Space>
        <Tooltip title="View">
          <Button
            icon={<EditOutlined />}
            type="text"
            className={`${styles.baseBtn} ${styles.viewBtn}`}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={() => onDelete(record.reviewId)}
            className={`${styles.baseBtn} ${styles.deleteBtn}`}
          />
        </Tooltip>
      </Space>
    ),
  },
];

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  loading,
  currentPage,
  initialPageSize,
  totalCount,
  onPageChange,
  onDelete,
}) => {
  const navigate = useNavigate();
  const columns = getReviewTableColumns(navigate, onDelete);

  return (
    <Table
      columns={columns}
      dataSource={reviews}
      loading={loading}
      rowKey="reviewId"
      pagination={{
        pageSize: initialPageSize,
        current: currentPage,
        total: totalCount,
        onChange: onPageChange,
      }}
      className={styles.tableContainer}
    />
  );
};

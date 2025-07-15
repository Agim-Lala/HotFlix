import { Table, Space, Button, Tooltip } from "antd";
import { LockOutlined, DeleteOutlined, StarFilled } from "@ant-design/icons";
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
}

const getReviewTableColumns = (
  _navigate: ReturnType<typeof useNavigate>
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
    render: () => (
      <Space>
        <Tooltip title="Lock/Unlock">
          <Button icon={<LockOutlined />} type="text" />
        </Tooltip>
        <Tooltip title="Delete">
          <Button icon={<DeleteOutlined />} type="text" danger />
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
}) => {
  const navigate = useNavigate();
  const columns = getReviewTableColumns(navigate);

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

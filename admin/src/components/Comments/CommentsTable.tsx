import { Table, Space, Button, Tooltip } from "antd";
import { LockOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Comment } from "../../api/commentApi";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./commentsTable.module.css";

interface CommentTableProps {
  comments: Comment[];
  loading: boolean;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const getCommentTableColumns = (
  _navigate: ReturnType<typeof useNavigate>
): ColumnsType<Comment> => [
  {
    title: "ID",
    dataIndex: "commentId",
    key: "commentId",
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
    render: (value: string) =>
      value.length > 50 ? value.slice(0, 50) + "..." : value,
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
            className={`${styles.baseBtn} ${styles.deleteBtn}`}
          />
        </Tooltip>
      </Space>
    ),
  },
];

export const CommentTable: React.FC<CommentTableProps> = ({
  comments,
  loading,
  currentPage,
  totalCount,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const columns = getCommentTableColumns(navigate);

  return (
    <Table
      columns={columns}
      dataSource={comments}
      loading={loading}
      rowKey="commentId"
      pagination={{
        current: currentPage,
        pageSize: 10,
        total: totalCount,
        onChange: onPageChange,
      }}
      className={styles.tableContainer}
    />
  );
};

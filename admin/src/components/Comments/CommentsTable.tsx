import { Table, Space, Button, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
  onDelete: (commentId: number) => void;
  onView: (commentId: number) => void;
}

const getCommentTableColumns = (
  _navigate: ReturnType<typeof useNavigate>,
  onDelete: (commentId: number) => void,
  onView: (commentId: number) => void
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
    dataIndex: "likesCount",
    key: "likeDislike",
    render: (_: any, record: Comment) => (
      <span>
        {record.likesCount ?? 0} / {record.dislikesCount ?? 0}
      </span>
    ),
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
            onClick={() => onView(record.commentId)}
            className={`${styles.baseBtn} ${styles.viewBtn}`}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={() => onDelete(record.commentId)}
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
  onDelete,
  onView,
}) => {
  const navigate = useNavigate();
  const columns = getCommentTableColumns(navigate, onDelete, onView);

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

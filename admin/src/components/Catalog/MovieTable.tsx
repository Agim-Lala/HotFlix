import { Table, Space, Button, Tooltip, message, App } from "antd";
import {
  LockOutlined,
  DeleteOutlined,
  StarFilled,
  EditOutlined,
} from "@ant-design/icons";
import { Movie } from "../../api/movieApi";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./MovieTable.module.css";

interface MovieTableProps {
  movies: Movie[];
  loading: boolean;
  currentPage?: number;
  totalCount?: number;
  initialPageSize?: number;
  onPageChange?: (page: number) => void;
  onToggleStatus?: (id: number) => void;
  handleDelete: (movieId: number) => void;
}

const getMovieTableColumns = (
  _navigate: ReturnType<typeof useNavigate>,
  handleDelete: (movieId: number) => void,
  handleToggleStatus: (movieId: number) => void
): ColumnsType<Movie> => [
  {
    title: "ID",
    dataIndex: "movieId",
    key: "movieId",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Rating",
    dataIndex: "averageRating",
    key: "averageRating",
    render: (rating: number) => (
      <span style={{ color: "#ffcc00" }}>
        <StarFilled /> {rating}
      </span>
    ),
  },
  {
    title: "Categories",
    dataIndex: "categories",
    key: "categories",
  },
  {
    title: "Views",
    dataIndex: "views",
    key: "views",
  },
  {
    title: "Status",
    dataIndex: "isVisible",
    key: "isVisible",
    render: (val: boolean | undefined) => (
      <span className={val ? styles.statusApproved : styles.statusBanned}>
        {val ? "Visible" : "Hidden"}
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
      <div className={styles.actionButtons}>
        <Tooltip title="View Details">
          <button
            className={`${styles.baseBtn} ${styles.viewBtn}`}
            onClick={() => _navigate(`/movies/${record.movieId}`)}
          >
            <EditOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Lock/Unlock">
          <button
            className={`${styles.baseBtn} ${styles.lockBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(record.movieId);
            }}
          >
            <LockOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Delete">
          <button
            className={`${styles.baseBtn} ${styles.deleteBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.movieId);
            }}
          >
            <DeleteOutlined />
          </button>
        </Tooltip>
      </div>
    ),
  },
];

export const MovieTable: React.FC<MovieTableProps> = ({
  movies,
  loading,
  currentPage,
  totalCount,
  initialPageSize,
  onPageChange,
  onToggleStatus,
  handleDelete,
}) => {
  const navigate = useNavigate();
  const columns = getMovieTableColumns(navigate, handleDelete, onToggleStatus!);

  return (
    <Table
      columns={columns}
      dataSource={movies}
      loading={loading}
      rowKey="movieId"
      onRow={(record) => ({
        onClick: () => navigate(`/movies/edit/${record.movieId}`),
      })}
      pagination={{
        current: currentPage,
        pageSize: initialPageSize,
        total: totalCount,
        onChange: onPageChange,
      }}
      className={styles.tableContainer}
    />
  );
};

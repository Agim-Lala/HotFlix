import { Table, Space, Button, Tooltip, message, App } from "antd";
import {
  LockOutlined,
  DeleteOutlined,
  StarFilled,
  EditOutlined,
} from "@ant-design/icons";
import { Movie, deleteMovieById } from "../../api/movieApi";
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
}

const getMovieTableColumns = (
  _navigate: ReturnType<typeof useNavigate>,
  handleDelete: (movieId: number) => void
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
      <Space>
        <Tooltip title="View Details">
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => _navigate(`/movies/${record.movieId}`)}
          />
        </Tooltip>
        <Tooltip title="Lock/Unlock">
          <Button icon={<LockOutlined />} type="text" />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.movieId);
            }}
          />
        </Tooltip>
      </Space>
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
}) => {
  const { message } = App.useApp();

  const navigate = useNavigate();
  const handleDelete = async (movieId: number) => {
    try {
      await deleteMovieById(movieId);
      message.success("Movie deleted");
    } catch {
      message.error("Failed to delete movie");
    }
  };
  const columns = getMovieTableColumns(navigate, handleDelete);

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

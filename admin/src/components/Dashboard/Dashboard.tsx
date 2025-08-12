import { Button } from "antd";
import {
  ColumnHeightOutlined,
  FileAddOutlined,
  MessageOutlined,
  StarFilled,
  StarOutlined,
  TrophyOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import styles from "./Dashboard.module.css";
import DashboardCard from "./DashboardCard";
import { Link } from "react-router-dom";
import {
  getMoviesSortedByCreatedAt,
  getMoviesSortedByRating,
  Movie,
  SortFields,
} from "../../api/movieApi";
import { getReviewsSortedById } from "../../api/reviewApi";
import { getUsersSortedByCreatedAt } from "../../api/userApi";
import { useNavigate } from "react-router";

export const metricItems = [
  {
    title: "Unique Views This Month",
    value: "5678",
    icon: <ColumnHeightOutlined className={styles.metricIcon} />,
  },
  {
    title: "Items Added This Month",
    value: "172",
    icon: <FileAddOutlined className={styles.metricIcon} />,
  },
  {
    title: "New Comments",
    value: "2573",
    icon: <MessageOutlined className={styles.metricIcon} />,
  },
  {
    title: "New Reviews",
    value: "1021",
    icon: <StarOutlined className={styles.metricIcon} />,
  },
];

const movieColumnsRating = [
  { title: "ID", dataIndex: "movieId", key: "movieId" },
  { title: "Title", dataIndex: "title", key: "title" },
  {
    title: "Category",
    dataIndex: "categories",
    key: "categories",
    render: (categories: string[]) => categories.join(", "),
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
];
const movieColumnsLatest = [
  { title: "ID", dataIndex: "movieId", key: "movieId" },
  { title: "Title", dataIndex: "title", key: "title" },
  {
    title: "Category",
    dataIndex: "categories",
    key: "categories",
    render: (categories: string[]) => categories.join(", "),
  },
  {
    title: "Status",
    dataIndex: "isVisible",
    key: "isVisible",
    render: (isVisible: boolean | undefined) => {
      if (isVisible === undefined) return "Unknown";
      return (
        <span style={{ color: isVisible ? "green" : "red" }}>
          {isVisible ? "Visible" : "Hidden"}
        </span>
      );
    },
  },
];
const userColumns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "Full Name", dataIndex: "fullName", key: "fullName" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Username", dataIndex: "username", key: "username" },
];

const reviewsColumns = [
  { title: "ID", dataIndex: "reviewId", key: "reviewId" },
  { title: "Title", dataIndex: "movieTitle", key: "movieTitle" },
  { title: "Author", dataIndex: "author", key: "author" },

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
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <SidebarLayout>
      <div className={styles.headerRow}>
        <h2 className={styles.dashboardTitle}>Dashboard</h2>
        <Link to="/add-movie">
          <Button className={styles.addNewButton}>Add New</Button>
        </Link>
      </div>

      <div className={styles.metricCardsContainer}>
        {metricItems.map((item, index) => (
          <div key={index} className={styles.metricCard}>
            <div>
              <div className={styles.metricTitle}>{item.title}</div>
              <div className={styles.metricValue}>{item.value}</div>
            </div>
            <div>{item.icon}</div>
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        <DashboardCard
          title="Top Items"
          icon={<TrophyOutlined className={styles.dashboardGridIcon} />}
          columns={movieColumnsRating}
          fetchData={async () => await getMoviesSortedByRating()}
          rowKey="movieId"
          onRowClick={(record) => navigate(`/movies/edit/${record.movieId}`)}
        />
        <DashboardCard<Movie>
          title="Latest Items"
          icon={<AppstoreOutlined className={styles.dashboardGridIcon} />}
          columns={movieColumnsLatest}
          fetchData={async () => await getMoviesSortedByCreatedAt()}
          rowKey="movieId"
          onRowClick={(record) => navigate(`/movies/edit/${record.movieId}`)}
        />
        <DashboardCard
          title="Latest Users"
          icon={<UserOutlined className={styles.dashboardGridIcon} />}
          columns={userColumns}
          fetchData={async () => await getUsersSortedByCreatedAt()}
          rowKey="id"
          onRowClick={(record) => navigate(`/users/${record.id}`)}
        />
        <DashboardCard
          title="Latest Reviews"
          icon={<StarOutlined className={styles.dashboardGridIcon} />}
          columns={reviewsColumns}
          fetchData={async () => await getReviewsSortedById()}
          rowKey="reviewId"
        />
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;

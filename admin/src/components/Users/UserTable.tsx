import { Table, Space, Button, Tooltip } from "antd";
import {
  LockOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { User } from "../../api/userApi";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./UserTable.module.css";

interface UserTableProps {
  users: User[];
  loading: boolean;
  currentPage?: number;
  totalCount?: number;
  initialPageSize?: number;
  onPageChange?: (page: number) => void;
}

const getUserTableColumns = (
  _navigate: ReturnType<typeof useNavigate>
): ColumnsType<User> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "User Details",
    key: "userDetails",
    render: (_, record) => (
      <div className={styles.userDetails}>
        <UserOutlined className={styles.userIcon} />
        <div>
          <div className={styles.userName}>
            {record.firstName} {record.lastName}
          </div>
          <div className={styles.userEmail}>{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Comments",
    dataIndex: "commentCount",
    key: "commentCount",
  },
  {
    title: "Reviews",
    dataIndex: "reviewCount",
    key: "reviewCount",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <span
        className={
          status === "Approved" ? styles.statusApproved : styles.statusBanned
        }
      >
        {status}
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
    render: () => (
      <Space>
        <Tooltip title="Lock/Unlock">
          <Button icon={<LockOutlined />} type="text" />
        </Tooltip>
        <Tooltip title="Edit">
          <Button icon={<EditOutlined />} type="text" />
        </Tooltip>
        <Tooltip title="Delete">
          <Button icon={<DeleteOutlined />} type="text" danger />
        </Tooltip>
      </Space>
    ),
  },
];

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  currentPage,
  initialPageSize,
  totalCount,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const columns = getUserTableColumns(navigate);

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: initialPageSize,
        current: currentPage,
        total: totalCount,
        onChange: onPageChange,
      }}
      className={styles.tableContainer}
      onRow={(record) => {
        return {
          key: record.id,
          onClick: () => navigate(`/users/${record.id}`),
        };
      }}
    />
  );
};

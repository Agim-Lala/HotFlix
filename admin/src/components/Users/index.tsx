import { useState, useEffect, useCallback } from "react";
import { Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import {
  fetchUsers,
  PaginatedUserResponse,
  SortFields,
} from "../../api/userApi";
import { UserTable } from "./UserTable";
import styles from "./Users.module.css";

const sortOptions = Object.values(SortFields);

const Users = () => {
  const [{ status, response }, setResponse] = useState<
    | { status: "successs"; response: PaginatedUserResponse }
    | { status: "loading" | "idle"; response: undefined }
    | { status: "error"; response: undefined; error: string }
  >({ status: "loading", response: undefined });
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.CreatedAt
  );

  const fetchUserData = useCallback(async (sortBy: SortFields) => {
    try {
      setResponse({ status: "loading", response: undefined });
      const response: PaginatedUserResponse = await fetchUsers({
        sortBy,
        ascending: true,
        page: 1,
        pageSize: 10,
      });
      setResponse({ status: "successs", response });
      console.log("Fetched users:", response.users);
    } catch (error) {
      console.error("Error fetching movies", error);
      setResponse({
        status: "error",
        response: undefined,
        error: (error as Error).message || "Failed to fetch users",
      });
    }
  }, []);

  useEffect(() => {
    fetchUserData(selectedSort);
  }, [selectedSort, fetchUserData]);

  return (
    <SidebarLayout>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>
            Users
            <span className={styles.userCount}>
              {response?.totalCount} Total
            </span>
          </div>
        </div>

        <Space align="end" size="middle">
          <div>
            <div className={styles.sortLabel}>Sort by:</div>
            <Select
              value={selectedSort}
              onChange={(value) => setSelectedSort(value)}
              className={styles.select}
              variant="borderless"
              options={sortOptions.map((item) => ({
                value: item,
                label: <span>{item}</span>,
              }))}
            />
          </div>

          <Input
            className={styles.input}
            placeholder="Find users ..."
            suffix={<SearchOutlined />}
            variant="borderless"
          />
        </Space>
      </div>

      <div className={styles.body}>
        <UserTable
          users={response?.users ?? []}
          loading={status === "loading"}
        />
      </div>
    </SidebarLayout>
  );
};

export default Users;

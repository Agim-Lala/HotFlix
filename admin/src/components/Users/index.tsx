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
import useQuery from "../../hooks/useQuery";

const sortOptions = Object.values(SortFields);

const Users = () => {
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.CreatedAt
  );

  const fetchResponse = useCallback(
    () =>
      fetchUsers({
        sortBy: selectedSort,
        ascending: true,
        page: 1,
        pageSize: 10,
      }),
    [selectedSort]
  );

  const {
    query: { status, response },
  } = useQuery(fetchResponse);

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

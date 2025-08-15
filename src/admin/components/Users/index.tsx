import { useState, useCallback, useEffect } from "react";
import { Input, message, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout";
import { fetchUsers, SortFields, toggleUserStatus } from "../../api/userApi";
import { UserTable } from "./UserTable";
import styles from "./Users.module.css";
import useQuery from "../../hooks/useQuery";
import { usePagination } from "../../hooks/usePagination";
import { useSearchParams } from "react-router";

const sortOptions = Object.values(SortFields);

const Users = () => {
  const [selectedSort, setSelectedSort] = useState<SortFields>(
    SortFields.CreatedAt
  );
  const [ascending, setAscending] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sortParam = searchParams.get("sortBy") as SortFields | null;
    if (
      sortParam &&
      Object.values(SortFields).includes(sortParam as SortFields)
    ) {
      setSelectedSort(sortParam as SortFields);
    }

    const pageParam = searchParams.get("page");
    if (pageParam) {
      onPageChange(Number(pageParam));
    }
  }, [searchParams]);

  const { pagination, onTotalCountChange, onPageChange } = usePagination(10);

  const fetchResponse = useCallback(
    () =>
      fetchUsers({
        sortBy: selectedSort,
        ascending,
        page: pagination.page,
        pageSize: pagination.pageSize,
      }),
    [selectedSort, ascending, pagination.page, pagination.pageSize]
  );

  const {
    query: { status, response },
    refetch,
  } = useQuery(fetchResponse);

  useEffect(() => {
    if (response?.totalCount) {
      onTotalCountChange(response.totalCount);
    }
  }, [response]);

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleUserStatus(id);
      message.success(`User status changed`);
      await refetch();
    } catch (error) {
      console.error(error);
      message.error("Failed to toggle user status.");
    }
  };

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
              onSelect={(value) => {
                if (value === selectedSort) {
                  setAscending((prev) => !prev);
                } else {
                  setSelectedSort(value);
                  setAscending(false);
                }
                onPageChange(1);
              }}
              className={styles.select}
              variant="borderless"
              options={sortOptions.map((item) => ({
                value: item,
                label: (
                  <span>
                    {item}
                    {selectedSort === item && (
                      <span style={{ marginLeft: 4 }}>
                        {ascending ? "↑" : "↓"}
                      </span>
                    )}
                  </span>
                ),
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
          currentPage={pagination.page}
          totalCount={pagination.totalCount}
          onPageChange={onPageChange}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </SidebarLayout>
  );
};

export default Users;

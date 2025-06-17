import { useState, useEffect, useCallback } from "react";
import { Input, Select, Space } from "antd";
import {SearchOutlined,} from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout"; 
import {fetchUsers, PaginatedUserResponse, SortFields, User } from "../../api/userApi"; 
import {UserTable} from "./UserTable";
import styles from "./Users.module.css";

const sortOptions = Object.values(SortFields); 


const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<SortFields>(SortFields.CreatedAt);
  const [loading, setLoading] = useState<boolean>(false);


  const fetchUserData = useCallback(async (sortBy: SortFields) => {
    try {
      setLoading(true);
      const response: PaginatedUserResponse = await fetchUsers({
        sortBy,
        ascending: true,
        page: 1,
        pageSize: 10, 
      });
      setUsers(response.users);
      setUserCount(response.totalCount);
      console.log("Fetched users:", response.users);

    } catch (error) {
      console.error("Error fetching movies", error);
    }finally {
      setLoading(false);
  }
  }, []); 

  useEffect(() => {
    fetchUserData(selectedSort);
  }, [selectedSort,fetchUserData]); 
      

  return (
    <SidebarLayout>
      
     <div className={styles.header}>
      <div>
        <div className={styles.title}>
          Users
          <span className={styles.userCount}>
            {userCount} Total
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
          suffix={<SearchOutlined  />}
          variant="borderless"
        />
      </Space>
    </div>

    <div className={styles.body}>
      <UserTable users={users} loading={loading} />
    </div>
  </SidebarLayout>
    
  );
};

export default Users;
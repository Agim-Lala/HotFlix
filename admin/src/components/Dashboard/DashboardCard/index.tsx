import React, { useCallback, useEffect, useState } from "react";
import { Card, Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import styles from "./DashboardCard.module.css"; 


interface DashboardCardProps<T> {
  title: string;
  icon: React.ReactNode;
  columns: any[];
  fetchData: () => Promise<T[]>;
  rowKey: string;
  onViewAll?: () => void;
}

function DashboardCard<T>({
  title,
  icon,
  columns,
  fetchData,
  rowKey,
  onViewAll = () => {},
}: DashboardCardProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

 
 
  const fetchTableData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(result.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

 /* const fetchTableData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(result.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

 useEffect(() => {
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(result.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTableData();
}, [fetchData]);

*/
  return (
    <Card className={styles.cardContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          {icon}
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <div className={styles.headerRight}>
          <ReloadOutlined
            onClick={fetchData}
            className={styles.reloadIcon}
          />
          <button onClick={onViewAll} className={styles.viewAllButton}>
            View All
          </button>
        </div>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
        rowKey={rowKey}
        bordered={false}
      />
    </Card>
  );
}
export default DashboardCard;


import React, { useCallback, useEffect, useState } from "react";
import { Card, Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import styles from "./DashboardCard.module.css";
import useQuery from "../../../hooks/useQuery";

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
  const fetchResponse = useCallback(async () => {
    const result = await fetchData();
    return result.slice(0, 5);
  }, [fetchData]);

  const {
    query: { response, status },
  } = useQuery(fetchResponse);

  return (
    <Card className={styles.cardContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          {icon}
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <div className={styles.headerRight}>
          <ReloadOutlined onClick={fetchData} className={styles.reloadIcon} />
          <button onClick={onViewAll} className={styles.viewAllButton}>
            View All
          </button>
        </div>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={response}
        pagination={false}
        loading={status === "loading" || status === "idle"}
        rowKey={rowKey}
        bordered={false}
      />
    </Card>
  );
}
export default DashboardCard;

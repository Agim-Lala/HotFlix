import React, { useEffect } from "react";
import styles from "./Dashboard.module.css";
import useQuery from "../../hooks/useQuery";

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  fetchResponse: () => Promise<{ count: number }>;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  fetchResponse,
}) => {
  const {
    query: { response, status },
  } = useQuery(fetchResponse);

  return (
    <div className={styles.metricCard}>
      <div>
        <div className={styles.metricTitle}>{title}</div>
        <div className={styles.metricValue}>
          {status === "loading" || status === "idle" ? "..." : response?.count}
        </div>
      </div>
      <div>{icon}</div>
    </div>
  );
};

export default MetricCard;

import { useEffect, useState } from "react";
import { getReviewById, ReviewDetail } from "../../api/reviewApi";
import { Drawer, Typography, Divider, Space, Spin } from "antd";
import styles from "./ReviewDrawer.module.css";

const { Title, Paragraph, Text } = Typography;

type Props = {
  open: boolean;
  reviewId: number | null;
  onClose: () => void;
};

export default function ReviewDrawer({ open, reviewId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewDetail | null>(null);

  useEffect(() => {
    if (!open || reviewId == null) return;
    let active = true;

    const fetchReview = async () => {
      try {
        setLoading(true);
        const data = await getReviewById(reviewId);
        if (active) setReview(data);
      } catch (err) {
        console.error("Failed to fetch review:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchReview();
    return () => {
      active = false;
    };
  }, [open, reviewId]);
  return (
    <Drawer
      title={review ? `Review Details` : "Loading..."}
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
      className={styles.drawer}
      bodyStyle={{ padding: "2rem" }}
    >
      {loading || !review ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.content}>
          <Text className={styles.label}>
            Movie Id: <Text className={styles.value}>{review.movieId}</Text>
          </Text>
          <Text className={styles.label}>
            Movie Title:{" "}
            <Text className={styles.value}>{review.movieTitle}</Text>
          </Text>
          <Text className={styles.label}>
            Author: <Text className={styles.value}>{review.author}</Text>
          </Text>
          <Text className={styles.label}>
            Rating: <Text className={styles.value}>{review.rating} ⭐</Text>
          </Text>
          <Divider />
          <Paragraph className={styles.reviewText}>{review.text}</Paragraph>
          <Text className={styles.label}>
            Created at:{" "}
            <Text className={styles.value}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </Text>
        </div>
      )}
    </Drawer>
  );
}

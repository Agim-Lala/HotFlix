import { useEffect, useState } from "react";
import { Drawer, Typography, Divider, Space, Spin } from "antd";
import dayjs from "dayjs";
import { CommentDetail, getCommentById } from "../../api/commentApi";
import styles from "./CommentViewDrawer.module.css";

const { Text, Paragraph, Title } = Typography;

type Props = {
  open: boolean;
  commentId: number | null;
  onClose: () => void;
};

export default function CommentViewDrawer({ open, commentId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CommentDetail | null>(null);

  useEffect(() => {
    let active = true;
    const fetchComment = async () => {
      if (!open || commentId == null) return;
      try {
        setLoading(true);
        const detail = await getCommentById(commentId);
        if (active) setData(detail);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchComment();
    return () => {
      active = false;
    };
  }, [open, commentId]);

  const renderReply = (reply: CommentDetail, depth = 0) => (
    <div
      key={reply.commentId}
      className={styles.repliesContainer}
      style={{ marginLeft: depth * 12 }}
    >
      <Space direction="vertical" size={2} style={{ width: "100%" }}>
        <Text type="secondary" style={{ color: "rgba(255,255,255,0.6)" }}>
          #{reply.commentId} • {reply.author} •{" "}
          {dayjs(reply.createdAt).format("DD MMM YYYY HH:mm")}
        </Text>
        <Paragraph className={styles.replyText}>{reply.text}</Paragraph>
      </Space>
      {reply.replies?.map((r) => renderReply(r, depth + 1))}
    </div>
  );

  return (
    <Drawer
      title="View Comment"
      placement="right"
      width={520}
      onClose={onClose}
      open={open}
    >
      {loading ? (
        <div className={styles.noData}>
          <Spin size="large" />
        </div>
      ) : !data ? (
        <Text className={styles.noData}>No data</Text>
      ) : (
        <div className={styles.drawerContainer}>
          <Space direction="vertical" style={{ width: "100%" }} size="small">
            <div className={styles.headerText}>
              <ul className={styles.headerList}>
                <li className={styles.headerListItem}>
                  Comment Id: {data.commentId}
                </li>
                <li className={styles.headerListItem}>Author: {data.author}</li>
                <li className={styles.headerListItem}>
                  Created At:{" "}
                  {dayjs(data.createdAt).format("DD MMM YYYY HH:mm")}
                </li>
              </ul>
            </div>

            <Text className={styles.movieTitle}>
              {"Movie Title:  "}
              {data.movieTitle}
            </Text>

            {data.quotedComment && (
              <div className={styles.quotedComment}>
                <Text type="secondary" className={styles.greyTextColor}>
                  Quoting Comment with Id: {data.quotedComment.commentId}
                </Text>
                <Paragraph className={styles.commentText}>
                  {data.quotedComment.text}
                </Paragraph>
              </div>
            )}

            <Title level={5} style={{ marginTop: 12, color: "#ffffff" }}>
              Comment
            </Title>
            <Paragraph className={styles.commentText}>{data.text}</Paragraph>

            <div className={styles.stats}>
              <Text>👍 {data.likesCount ?? 0}</Text>
              <Text>👎 {data.dislikesCount ?? 0}</Text>
            </div>

            <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

            <Title level={5} style={{ marginBottom: 6, color: "#ffffff" }}>
              Replies ({data.replies?.length ?? 0})
            </Title>
            {data.replies?.length ? (
              <div>{data.replies.map((r) => renderReply(r))}</div>
            ) : (
              <Text type="secondary" style={{ color: "rgba(255,255,255,0.6)" }}>
                No replies
              </Text>
            )}
          </Space>
        </div>
      )}
    </Drawer>
  );
}

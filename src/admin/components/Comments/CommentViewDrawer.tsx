import { useEffect, useState } from "react";
import { Drawer, Typography, Divider, Space, Spin, Tag, Avatar } from "antd";
import dayjs from "dayjs";
import { CommentDetail, getCommentById } from "../../api/commentApi";
import styles from "./CommentViewDrawer.module.css";
import {
  DislikeOutlined,
  LikeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

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
      className={styles.replyCard}
      style={{ marginLeft: depth * 16 }}
    >
      <div className={styles.replyHeader}>
        <Avatar size={28}>{reply.author.charAt(0).toUpperCase()}</Avatar>
        <div className={styles.replyMeta}>
          <Text className={styles.replyAuthor}>{reply.author}</Text>
          <Text className={styles.replyDate}>
            {dayjs(reply.createdAt).format("DD MMM YYYY HH:mm")}
          </Text>
        </div>
      </div>
      <Paragraph className={styles.replyText}>{reply.text}</Paragraph>
      {reply.replies?.map((r) => renderReply(r, depth + 1))}
    </div>
  );

  return (
    <Drawer
      title={<span className={styles.drawerTitle}>💬 Comment Details</span>}
      placement="right"
      width={560}
      onClose={onClose}
      open={open}
      className={styles.drawerRoot}
    >
      {loading ? (
        <div className={styles.loaderContainer}>
          <Spin size="large" />
        </div>
      ) : !data ? (
        <Text className={styles.noData}>No comment found</Text>
      ) : (
        <div className={styles.drawerContainer}>
          {}
          <div className={styles.commentHeader}>
            <Avatar size={42} className={styles.avatar}>
              {data.author.charAt(0).toUpperCase()}
            </Avatar>
            <div className={styles.metaInfo}>
              <Text className={styles.author}>{data.author}</Text>
              <Text className={styles.date}>
                {dayjs(data.createdAt).format("DD MMM YYYY HH:mm")}
              </Text>
            </div>
          </div>

          <Text className={styles.movieTag}>
            {" "}
            <VideoCameraOutlined style={{ marginRight: 6 }} /> {data.movieTitle}
          </Text>

          {data.parentComment && (
            <div className={styles.parentComment}>
              <Text className={styles.parentLabel}>
                Replying to {data.parentComment.author}'s comment #:
              </Text>
              <Paragraph className={styles.parentText}>
                {data.parentComment.text}
              </Paragraph>
            </div>
          )}

          {data.quotedComment && (
            <div className={styles.quotedComment}>
              <Text className={styles.quotedLabel}>
                Quoting comment #{data.quotedComment.commentId}
              </Text>
              <Paragraph className={styles.quotedText}>
                {data.quotedComment.text}
              </Paragraph>
            </div>
          )}

          <Title level={5} className={styles.sectionTitle}>
            Comment
          </Title>
          <Paragraph className={styles.commentText}>{data.text}</Paragraph>

          <div className={styles.stats}>
            <Tag color="green">
              <LikeOutlined /> {data.likesCount}
            </Tag>
            <Tag color="red">
              <DislikeOutlined /> {data.dislikesCount}
            </Tag>
          </div>

          <Divider className={styles.divider} />

          <Title level={5} className={styles.sectionTitle}>
            Replies ({data.replies?.length ?? 0})
          </Title>
          {data.replies?.length ? (
            <div className={styles.repliesWrapper}>
              {data.replies.map((r) => renderReply(r))}
            </div>
          ) : (
            <Text className={styles.noReplies}>No replies</Text>
          )}
        </div>
      )}
    </Drawer>
  );
}

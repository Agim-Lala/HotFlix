import { type FC, memo, useCallback, useEffect, useState } from "react";
import { Tabs, message, Spin } from "antd";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../api/userApi";
import UserProfileForm from "./UserProfileForm";
import type { User } from "../../../api/userApi";
import UserPasswordForm from "./UserPasswordForm";
import styles from "./UserEdit.module.css";
import { LockOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

type TabKeys = "profile" | "comments" | "reviews";
const tabItems: { key: TabKeys; label: string }[] = [
  { key: "profile", label: "PROFILE" },
  { key: "comments", label: "COMMENTS" },
  { key: "reviews", label: "REVIEWS" },
];

const TabContent = memo(
  ({
    user,
    activeTab,
    onSaveUser,
  }: {
    user: User | null;
    activeTab: TabKeys;
    onSaveUser: ((updated: User) => void) | undefined;
  }) => {
    switch (activeTab) {
      case "profile":
        return (
          user &&
          onSaveUser && (
            <div className={styles.formsContainer}>
              <div className={styles.formBox}>
                <UserProfileForm
                  user={user}
                  userId={user.id}
                  onSave={onSaveUser}
                />
              </div>

              <div className={styles.formBox}>
                <UserPasswordForm userId={user.id} />
              </div>
            </div>
          )
        );
      case "comments":
        return <div>Comments Section</div>;

      case "reviews":
        return <div>Reviews Section</div>;

      default:
        return null;
    }
  }
);

const UserEditPage: FC = () => {
  const userId = Number(useParams().id);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<TabKeys>("profile");

  const fetchUser = useCallback(async () => {
    if (isNaN(userId)) return;
    setLoading(true);
    try {
      const data = await getUserById(userId);
      console.log("[UserEditPage] Loaded user:", data);
      setUser(data);
    } catch (error) {
      message.error("Failed to fetch user.");
    } finally {
      setLoading(false);
    }
  }, [userId, setUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleTabChange = (key: TabKeys) => setActiveTab(key);

  if (loading) return <Spin size="large" />;
  if (!user || !user.id) return <div>User not found.</div>;

  return (
    <div className={styles.userEditPage}>
      <h1>Edit User</h1>

      <div className={styles.userHeader}>
        <div className={styles.userInfoBlock}>
          <div className={styles.userInfo}>
            <UserOutlined className={styles.userIcon} />
            <div>
              <h2 className={styles.userName}>
                {user.firstName} {user.lastName}
                <span
                  className={
                    user.status === "Approved"
                      ? styles.statusApproved
                      : styles.statusBanned
                  }
                >
                  ({user.status})
                </span>
              </h2>
              <p className={styles.userId}>HotFlix ID: {user.id}</p>
            </div>
          </div>
          <div className={styles.tabWrapper}>
            <Tabs
              className={styles.customTabs}
              items={tabItems}
              activeKey={activeTab}
              onChange={(key) => handleTabChange(key as TabKeys)}
            />
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.lockBtn}>
            <LockOutlined />
          </button>
          <button className={styles.deleteBtn}>
            <DeleteOutlined />
          </button>
        </div>
      </div>
      <TabContent
        user={user}
        activeTab={activeTab}
        onSaveUser={(updated) => setUser(updated)}
      />
    </div>
  );
};

export default UserEditPage;

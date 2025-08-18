import React, { useEffect, useState } from "react";
import { Layout, Button, Avatar, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { User, getMe } from "../../api/userApi";

import styles from "./SidebarLayout.module.css";
import SidebarMenu from "./SidebarMenu";

const { Sider, Content } = Layout;
const { Text } = Typography;

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe()
      .then((user) => {
        if (!user || !localStorage.getItem("token")) {
          alert(
            "You do not have permission to access the admin panel. Redirecting to the main page..."
          );
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
          return;
        }

        setUser(user);

        if (user.role !== "Admin") {
          alert(
            "You do not have permission to access the admin panel. Redirecting to the main page..."
          );
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        alert(
          "You do not have permission to access the admin panel. Redirecting to the main page..."
        );
        window.location.href = "index.html";
      });
  }, []);

  const handleLogout = () => {
    window.location.href = "index.html";
  };

  return (
    <Layout>
      <Sider width={220} className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.userInfo}>
            <Avatar icon={<UserOutlined />} size="large" />
            <div>
              <Text className={styles.role}>{user?.role || "Admin"}</Text>
              <br />
              <Text className={styles.name}>
                {user ? `${user.firstName} ${user.lastName}` : "John Doe"}
              </Text>
            </div>
          </div>
          <Button
            icon={<LogoutOutlined />}
            className={styles.logoutBtn}
            onClick={handleLogout}
          />
        </div>

        <SidebarMenu />
      </Sider>

      <Layout>
        <Content className={styles.layoutBackground}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;

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
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in admin app localStorage");
        return;
      }
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch admin info:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "http://127.0.0.1:5500/client/HotFlix.html";
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
                {user?.username || "Loading..."}
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

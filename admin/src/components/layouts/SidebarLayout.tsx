import React from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Typography,
} from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  UserOutlined,
  MessageOutlined,
  StarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SidebarLayout.module.css";

const { Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: "/", label: "Dashboard", icon: <DashboardOutlined /> },
  { key: "/catalog", label: "Catalog", icon: <AppstoreOutlined /> },
  { key: "/pages", label: "Pages", icon: <FileTextOutlined /> },
  { key: "/users", label: "Users", icon: <UserOutlined /> },
  { key: "/comments", label: "Comments", icon: <MessageOutlined /> },
  { key: "/reviews", label: "Reviews", icon: <StarOutlined /> },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
<Layout >
      <Sider width={220} className={styles.sidebar}>
  <div className={styles.sidebarHeader}>
    <div className={styles.userInfo}>
      <Avatar icon={<UserOutlined />} size="large" />
      <div>
        <Text className={styles.role}>Admin</Text>
        <br />
        <Text className={styles.name}>John Doe</Text>
      </div>
    </div>
    <Button icon={<LogoutOutlined />} className={styles.logoutBtn} />
  </div>

  <Menu
    theme="dark"
    mode="inline"
    selectedKeys={[location.pathname]}
    className={styles.menu}
    items={menuItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      onClick: () => navigate(item.key),
      className: styles.menuItem,
    }))}
  />
</Sider>

<Layout>
  <Content className={styles.layoutBackground} >
    {children}
  </Content>
</Layout>
</Layout>
  );
};

export default SidebarLayout;

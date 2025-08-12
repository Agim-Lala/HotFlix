import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SidebarLayout.module.css";

const menuItems = [
  { key: "/", label: "Dashboard", icon: <DashboardOutlined /> },
  { key: "/catalog", label: "Catalog", icon: <AppstoreOutlined /> },
  { key: "/users", label: "Users", icon: <UserOutlined /> },
  { key: "/comments", label: "Comments", icon: <MessageOutlined /> },
  { key: "/reviews", label: "Reviews", icon: <StarOutlined /> },
];

const SidebarMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
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
  );
};

export default SidebarMenu;

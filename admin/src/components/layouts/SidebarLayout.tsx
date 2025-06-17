import React from "react";
import {
  Layout,
  Button,
  Avatar,
  Typography,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import styles from "./SidebarLayout.module.css";
import SidebarMenu from "./SidebarMenu";

const { Sider, Content } = Layout;
const { Text } = Typography;

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {

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

 <SidebarMenu />
</Sider>

<Layout>
  <Content className={styles.layoutBackground} >{children}</Content>
</Layout>
</Layout>
  );
};

export default SidebarLayout;

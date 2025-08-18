import type { ThemeConfig } from 'antd'

export const darkTheme: ThemeConfig = {
  token: {
        colorBgBase: "#1c1c1c", 
        colorBgContainer: "#1c1c1c", 
        colorText: "#ffffff", 
        colorTextSecondary: "rgba(255, 255, 255, 0.6)",
        colorBorder: "rgba(255, 255, 255, 0.1)",
      },
      components: {
        Layout: {
          headerBg: "#1c1c1c",
          bodyBg: "#1c1c1c",
          colorBgLayout: "#1c1c1c",
        },
        Table: {
          headerBg: "#1c1c1c",
          bodySortBg: "#1c1c1c",
        },
      },
    }


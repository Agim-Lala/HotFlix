import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import { createBrowserRouter,RouterProvider,} from "react-router-dom"; 

import Dashboard from './components/Dashboard/Dashboard';
import Catalog from './components/Catalog/Catalog';
import { ConfigProvider } from 'antd';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard/> ,
  },
  {
    path: "/catalog",
    element: <Catalog/>,
  },
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{
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

    }}>
        <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>
);
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import {darkTheme} from './themes/themeConfig';
import { createBrowserRouter,RouterProvider,} from "react-router-dom"; 
import Dashboard from './components/Dashboard/Dashboard';
import Catalog from './components/Catalog/Catalog';
import Users from './components/Users';
import UserEditPage from './components/Users/UserEdit';
import { ConfigProvider, App as AntdApp } from 'antd';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard/> ,
  },
  {
    path: "/catalog",
    element: <Catalog/>,
  },
  {
    path: "/users",
    element: <Users/>,
  },
  {
    path: "/users/:id", 
    element: <UserEditPage />,
  },
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={darkTheme }>
       <AntdApp> {}
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);
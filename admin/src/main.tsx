import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import {darkTheme} from './themes/themeConfig';
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
    <ConfigProvider theme={darkTheme }>
        <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>
);
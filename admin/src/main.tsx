import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./index.css";
import { darkTheme } from "./themes/themeConfig";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Catalog from "./components/Catalog/Catalog";
import Users from "./components/Users";
import Reviews from "./components/Reviews";
import Comments from "./components/Comments";
import AddMovieForm from "./components/Catalog/NewMovie";
import UserEditPage from "./components/Users/UserEdit";
import EditMovieForm from "./components/Catalog/EditMovie";
import { ConfigProvider, App as AntdApp } from "antd";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/catalog",
    element: <Catalog />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/users/:id",
    element: <UserEditPage />,
  },
  {
    path: "/reviews",
    element: <Reviews />,
  },
  {
    path: "/comments",
    element: <Comments />,
  },
  {
    path: "/add-movie",
    element: <AddMovieForm />,
  },
  {
    path: "/movies/edit/:id",
    element: <EditMovieForm />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={darkTheme}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);

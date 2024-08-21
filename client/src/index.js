import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Layout from "./Component/Layout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import Authors from "./pages/Authors";
import CreatePost from "./pages/CreatePost";
import CategoryPosts from "./pages/CategoryPosts";
import AuthorPosts from "./pages/AuthorPosts";
import EditPost from "./pages/EditPost";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import DeletePost from "./pages/DeletePost";
import UserProvider from "./Context/userContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <LoginPage /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "authors", element: <Authors /> },
      { path: "create", element: <CreatePost /> },
      { path: "posts/categories/:category", element: <CategoryPosts /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <Dashboard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "posts/:id/delete", element: <DeletePost /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

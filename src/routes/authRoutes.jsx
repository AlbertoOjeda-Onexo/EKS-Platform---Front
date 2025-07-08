import React from "react";
import LoginPage from "../pages/system/LoginPage";
import RegisterPage from "../pages/system/RegisterPage";

export const authRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];

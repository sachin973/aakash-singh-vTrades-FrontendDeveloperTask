import React, { lazy } from "react";
// import { Redirect } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
export const routes = [

  {
    exact: true,
    path: "/",
    layout: AuthLayout,
    component: lazy(() => import("./view/login")),
  },
  {
    exact: true,
    path: "/signup",
    layout: AuthLayout,
    component: lazy(() => import("./view/register")),
  },
  {
    exact: true,
    path: "/otpverify",
    layout: AuthLayout,
    component: lazy(() => import("./view/otpVerifyy")),
  },
  {
    exact: true,
    path: "/forgot-password",
    layout: AuthLayout,
    component: lazy(() => import("./view/forgot")),
  },
  {
    exact: true,
    path: "/create-new-password",
    layout: AuthLayout,
    component: lazy(() => import("./view/createNewPassword")),
  }
  // {
  //   component: () => <Redirect to="/404" />,
  // },
];



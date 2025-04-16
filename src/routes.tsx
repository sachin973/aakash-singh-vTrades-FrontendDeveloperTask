import { lazy } from 'react';
import AuthLayout from './layout/AuthLayout';
import { RouteType } from './types/RouteType'; // 👈 We'll define this type next

export const routes: RouteType[] = [
  {
    path: '/',
    layout: AuthLayout,
    component: lazy(() => import('./view/login')),
  },
  {
    path: '/signup',
    layout: AuthLayout,
    component: lazy(() => import('./view/register')),
  },
  {
    path: '/otpverify',
    layout: AuthLayout,
    component: lazy(() => import('./view/otpVerifyy')),
  },
  {
    path: '/forgot-password',
    layout: AuthLayout,
    component: lazy(() => import('./view/forgot')),
  },
  {
    path: '/create-new-password',
    layout: AuthLayout,
    component: lazy(() => import('./view/createNewPassword.tsx')),
  },
];

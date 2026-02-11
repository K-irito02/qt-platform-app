import { lazy, Suspense, ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from '@/layouts/MainLayout';

const LazyLoad = (Component: React.LazyExoticComponent<ComponentType<unknown>>) => (
  <Suspense fallback={<Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '30vh' }} />}>
    <Component />
  </Suspense>
);

// 懒加载页面
const Home = lazy(() => import('@/pages/Home'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: LazyLoad(Home) },
      { path: 'products', element: LazyLoad(Products) },
      { path: 'products/:slug', element: LazyLoad(ProductDetail) },
      { path: 'login', element: LazyLoad(Login) },
      { path: 'register', element: LazyLoad(Register) },
      { path: '404', element: LazyLoad(NotFound) },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

export default router;

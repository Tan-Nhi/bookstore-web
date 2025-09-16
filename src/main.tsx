import { GoogleOAuthProvider } from '@react-oauth/google';
import { App, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import ProtectedRoute from 'components/auth';
import { AppProvider } from 'components/context/app.context.tsx';
import DashBoardPage from 'pages/admin/dashboard.tsx';
import AboutPage from 'pages/client/about.tsx';
import LoginPage from 'pages/client/auth/login.tsx';
import RegisterPage from 'pages/client/auth/register.tsx';
import BookPage from 'pages/client/book.tsx';
import HomePage from 'pages/client/home.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "styles/global.scss";
import LayoutAdmin from './components/layout/layout.admin.tsx';
import Layout from './layout.tsx';
import ManageBookPage from './pages/admin/manage.book.tsx';
import ManageOrderPage from './pages/admin/manage.order.tsx';
import ManageUserPage from './pages/admin/manage.user.tsx';
import ErrorPage from './pages/client/error.tsx';
import OrderPage from './pages/client/order.tsx';
import HistoryPage from './components/client/checkout/history.tsx';
// import viVN from 'antd/locale/vi_VN';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      }
    ]
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        )
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <div>admin page</div>
          </ProtectedRoute>
        ),
      },

    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App>
        <AppProvider>
          <ConfigProvider locale={enUS}>
            <RouterProvider router={router} />
          </ConfigProvider>
        </AppProvider>
      </App>
    </GoogleOAuthProvider>
  </StrictMode>,
)

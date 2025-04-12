import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserProfile from './pages/UserProfile';
import UserSettings from './pages/UserSettings';
import Disputes from './pages/Disputes';
// import Admin from './pages/Admin';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin components
// const Dashboard = lazy(() => import('./components/admin/Dashboard'));
// const ProductManagement = lazy(() => import('./components/admin/ProductManagement'));
// const OrderManagement = lazy(() => import('./components/admin/OrderManagement'));

// Auth guard component
const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Import context
import { AuthContext } from './contexts/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'products',
        element: <Products />
      },
      {
        path: 'products/:productId',
        element: <ProductDetail />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      {
        path: 'order-confirmation/:orderId',
        element: (
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <UserSettings />
          </ProtectedRoute>
        )
      },
      {
        path: 'disputes',
        element: (
          <ProtectedRoute>
            <Disputes />
          </ProtectedRoute>
        )
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading dashboard...</div>}>
                <Dashboard />
              </Suspense>
            )
          },
          {
            path: 'products',
            element: (
              <Suspense fallback={<div>Loading product management...</div>}>
                <ProductManagement />
              </Suspense>
            )
          },
          {
            path: 'orders',
            element: (
              <Suspense fallback={<div>Loading order management...</div>}>
                <OrderManagement />
              </Suspense>
            )
          }
        ]
      },
      {
        path: '*',
        element: <div>Page not found</div>
      }
    ]
  }
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import OrderConfirmation from './components/OrderConfirmation';
import AdminPanel from './components/AdminPanel';
import ProductEdit from './components/ProductEdit';
import ProductCreate from './components/ProductCreate';
import UserProfile from './components/UserProfile';
import OrderHistory from './components/OrderHistory';
import NotFound from './components/NotFound';

import { AppProvider, AppContext } from './context/AppContext';
import './App.css';

const Layout = () => (
  <>
    <Header />
    <main className="py-3">
      <div className="container">
        <Outlet />
      </div>
    </main>
  </>
);

const AdminLayout = () => {
  const { state } = React.useContext(AppContext);
  if (!state.userInfo?.isAdmin) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <ProductList /> },
      { path: '/cart', element: <Cart /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/profile', element: <UserProfile /> },
      { path: '/order-history', element: <OrderHistory /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/order/:id', element: <OrderConfirmation /> },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminPanel /> },
          { path: 'products', element: <AdminPanel /> },  // Added explicit products route
          { path: 'products/create', element: <ProductCreate /> },
          { path: 'products/:id/edit', element: <ProductEdit /> }
        ]
      },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
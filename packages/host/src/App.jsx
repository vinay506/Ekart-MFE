import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuthUser, selectIsAuthenticated } from './store/authSlice';
import AuthGuard from './components/AuthGuard';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import FormDemoPage from './pages/FormDemoPage';
import './App.css';

const ProductList = lazy(() => import('products/ProductList'));
const Cart        = lazy(() => import('cart/Cart'));

const PageLoader = ({ label }) => (
  <div className="page-loader">{label || 'Loading...'}</div>
);

const Header = () => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user            = useSelector(selectAuthUser);
  const isAdmin         = user?.role === 'admin';

  // Let remotes request navigation without importing react-router-dom
  useEffect(() => {
    const handler = (e) => navigate(e.detail);
    window.addEventListener('ekart:navigate', handler);
    return () => window.removeEventListener('ekart:navigate', handler);
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">🛒</span>
        <h1>Ekart</h1>
      </div>

      {isAuthenticated && (
        <nav className="header-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Cart
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Orders
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Profile
          </NavLink>
          <NavLink to="/form-demo" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Form Demo
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link nav-link--admin active' : 'nav-link nav-link--admin'}>
              Admin
            </NavLink>
          )}
        </nav>
      )}

      {isAuthenticated && (
        <div className="header-user">
          <span className="header-username">{user?.name}</span>
          <span className={`header-role header-role--${user?.role}`}>{user?.role}</span>
          <button className="btn-logout" onClick={handleLogout}>Sign out</button>
        </div>
      )}
    </header>
  );
};

const App = () => (
  <div className="app">
    <Header />
    <main className="main">
      <Routes>
        {/* Public */}
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Authenticated — all logged-in users */}
        <Route path="/" element={
          <AuthGuard>
            <Suspense fallback={<PageLoader label="Loading products..." />}>
              <ProductList />
            </Suspense>
          </AuthGuard>
        } />
        <Route path="/cart" element={
          <AuthGuard>
            <Suspense fallback={<PageLoader label="Loading cart..." />}>
              <Cart />
            </Suspense>
          </AuthGuard>
        } />
        <Route path="/orders"    element={<AuthGuard><OrdersPage /></AuthGuard>} />
        <Route path="/profile"   element={<AuthGuard><ProfilePage /></AuthGuard>} />
        <Route path="/form-demo" element={<AuthGuard><FormDemoPage /></AuthGuard>} />

        {/* Admin only */}
        <Route path="/admin" element={
          <AuthGuard requiredRole="admin">
            <AdminPage />
          </AuthGuard>
        } />

        <Route path="*" element={<div className="not-found">404 — Page not found</div>} />
      </Routes>
    </main>
  </div>
);

export default App;

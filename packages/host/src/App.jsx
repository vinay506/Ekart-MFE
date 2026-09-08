import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuthUser, selectIsAuthenticated } from './store/authSlice';
import AuthGuard from './components/AuthGuard';
import LoginPage from './pages/LoginPage';
import './App.css';

const ProductList = lazy(() => import('products/ProductList'));
const Cart        = lazy(() => import('cart/Cart'));

const PageLoader = ({ label }) => (
  <div className="page-loader">{label || 'Loading...'}</div>
);

const Header = () => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();

  // Let remotes request navigation without importing react-router-dom
  useEffect(() => {
    const handler = (e) => navigate(e.detail);
    window.addEventListener('ekart:navigate', handler);
    return () => window.removeEventListener('ekart:navigate', handler);
  }, [navigate]);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user            = useSelector(selectAuthUser);

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
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Suspense fallback={<PageLoader label="Loading products..." />}>
                <ProductList />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/cart"
          element={
            <AuthGuard>
              <Suspense fallback={<PageLoader label="Loading cart..." />}>
                <Cart />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route path="*" element={<div className="not-found">404 — Page not found</div>} />
      </Routes>
    </main>
  </div>
);

export default App;

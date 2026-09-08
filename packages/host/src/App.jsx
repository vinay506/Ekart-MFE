import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';

// Module Federation remotes are loaded lazily on the client.
// On the server the webpack bundle doesn't include these — the shell
// renders a placeholder and the client hydrates + loads the remotes.
const ProductList = lazy(() => import('products/ProductList'));
const Cart = lazy(() => import('cart/Cart'));

const PageLoader = ({ label }) => (
  <div className="page-loader">{label || 'Loading...'}</div>
);

const App = () => (
  <div className="app">
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">🛒</span>
        <h1>Ekart</h1>
      </div>
      <nav className="header-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Products
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Cart
        </NavLink>
      </nav>
    </header>

    <main className="main">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader label="Loading products..." />}>
              <ProductList />
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<PageLoader label="Loading cart..." />}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={<div className="not-found">404 — Page not found</div>}
        />
      </Routes>
    </main>
  </div>
);

export default App;

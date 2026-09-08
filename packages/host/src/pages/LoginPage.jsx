import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearAuthError, selectIsAuthenticated, selectAuthError } from '../store/authSlice';
import './LoginPage.css';

const LoginPage = () => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authError       = useSelector(selectAuthError);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Already logged in → go to products
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearAuthError()); };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🛒</div>
        <h1 className="login-title">Ekart</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin or user"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {authError && <p className="login-error" role="alert">{authError}</p>}

          <button className="login-btn" type="submit">Sign In</button>
        </form>

        <div className="login-hint">
          <p><strong>admin</strong> / admin123 — full access + checkout</p>
          <p><strong>user</strong> / user123 — browse &amp; add to cart</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAuthUser } from '../store/authSlice';
import './ProfilePage.css';

const ProfilePage = () => {
  const user     = useSelector(selectAuthUser);
  const navigate = useNavigate();
  const isAdmin  = user?.role === 'admin';

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '?';

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Avatar */}
        <div className={`profile-avatar profile-avatar--${user?.role}`}>{initials}</div>
        <h2 className="profile-name">{user?.name}</h2>
        <span className={`profile-badge profile-badge--${user?.role}`}>
          {isAdmin ? 'Administrator' : 'Customer'}
        </span>

        <div className="profile-info">
          <div className="profile-row">
            <span className="profile-label">Username</span>
            <span className="profile-value">{user?.username}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Role</span>
            <span className="profile-value">{user?.role}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Member since</span>
            <span className="profile-value">September 2026</span>
          </div>
        </div>

        {/* Role-specific section */}
        {isAdmin ? (
          <div className="profile-section profile-section--admin">
            <h3>System Administration</h3>
            <p>You have full administrative access to Ekart.</p>
            <div className="profile-stats">
              <div className="profile-stat"><strong>2</strong><span>Users</span></div>
              <div className="profile-stat"><strong>5</strong><span>Orders</span></div>
              <div className="profile-stat"><strong>100+</strong><span>Products</span></div>
            </div>
            <button className="profile-action-btn profile-action-btn--admin" onClick={() => navigate('/admin')}>
              Go to Admin Panel →
            </button>
          </div>
        ) : (
          <div className="profile-section profile-section--user">
            <h3>My Account</h3>
            <p>Manage your orders and preferences.</p>
            <div className="profile-stats">
              <div className="profile-stat"><strong>2</strong><span>Orders</span></div>
              <div className="profile-stat"><strong>1</strong><span>In Cart</span></div>
            </div>
            <button className="profile-action-btn profile-action-btn--user" onClick={() => navigate('/orders')}>
              View My Orders →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

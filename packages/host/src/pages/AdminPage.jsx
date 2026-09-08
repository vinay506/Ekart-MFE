import React from 'react';
import './AdminPage.css';

const MOCK_USERS = [
  { username: 'admin', name: 'Admin User', role: 'admin', status: 'active',  orders: 3 },
  { username: 'user',  name: 'Guest User', role: 'user',  status: 'active',  orders: 2 },
];

const STATS = [
  { label: 'Total Users',    value: 2,    color: '#4f8ef7' },
  { label: 'Total Orders',   value: 5,    color: '#22c55e' },
  { label: 'Products',       value: 100,  color: '#f59e0b' },
  { label: 'Active Sessions',value: 1,    color: '#a855f7' },
];

const AdminPage = () => (
  <div className="admin-page">
    <div className="admin-header">
      <h2 className="page-title">Admin Panel</h2>
      <span className="admin-badge">Admin only</span>
    </div>

    {/* Stats row */}
    <div className="admin-stats">
      {STATS.map((s) => (
        <div key={s.label} className="admin-stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
          <strong style={{ color: s.color }}>{s.value}</strong>
          <span>{s.label}</span>
        </div>
      ))}
    </div>

    {/* User management */}
    <section className="admin-section">
      <h3>User Management</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Orders</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_USERS.map((u) => (
            <tr key={u.username}>
              <td>{u.name}</td>
              <td className="admin-username">{u.username}</td>
              <td>
                <span className={`role-chip role-chip--${u.role}`}>{u.role}</span>
              </td>
              <td>{u.orders}</td>
              <td>
                <span className="status-chip status-chip--active">{u.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </div>
);

export default AdminPage;

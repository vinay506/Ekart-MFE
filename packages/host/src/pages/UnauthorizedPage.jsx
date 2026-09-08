import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a2e' }}>
        Access Denied
      </h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        You don't have permission to view this page.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          background: '#1a1a2e', color: '#fff', border: 'none',
          borderRadius: '8px', padding: '0.65rem 1.5rem',
          fontSize: '0.95rem', cursor: 'pointer',
        }}
      >
        Back to Products
      </button>
    </div>
  );
};

export default UnauthorizedPage;

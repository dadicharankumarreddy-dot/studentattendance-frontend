import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UnauthorizedPage = () => {
  const { user, isTeacher } = useAuth();

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛔</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Access Denied
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
          You do not have the required permissions to access this page.
          {user && (
            <span style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              Logged in as: <strong>{user.email}</strong> (Role: {user.role})
            </span>
          )}
        </p>
        <Link
          to={isTeacher ? '/teacher/dashboard' : '/student/dashboard'}
          className="btn btn-primary"
        >
          Return to Your Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

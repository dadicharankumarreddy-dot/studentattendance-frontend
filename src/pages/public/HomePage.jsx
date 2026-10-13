import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, isTeacher, isStudent } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          padding: '4rem 1rem 3rem 1rem',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          🎓 Full Stack Student Attendance System
        </div>

        <h1
          style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Track Student Attendance with Confidence & Simplicity
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
          }}
        >
          A clean, modern attendance portal engineered specifically for academic environments.
          Teachers organize classes and record daily attendance; students monitor their presence and percentage in real-time.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <Link
              to={isTeacher ? '/teacher/dashboard' : '/student/dashboard'}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              Go to Your Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Register as Teacher or Student
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Roles Grid */}
      <section style={{ marginTop: '3.5rem' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.75rem',
            fontWeight: 700,
            marginBottom: '2.5rem',
          }}
        >
          Designed for Clarity and Separation of Roles
        </h2>

        <div className="card-grid">
          {/* Teacher Card */}
          <div className="card" style={{ borderTop: '4px solid #6366f1' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                marginBottom: '1.25rem',
              }}
            >
              👨‍🏫
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Teacher Workflow
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              Complete command over classes and daily sessions:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Create and manage courses with unique class codes</li>
              <li>Enroll registered students by email address</li>
              <li>Schedule attendance sessions for any date</li>
              <li>Mark students as PRESENT or ABSENT in one click</li>
              <li>Update past session records anytime if corrections occur</li>
            </ul>
          </div>

          {/* Student Card */}
          <div className="card" style={{ borderTop: '4px solid #06b6d4' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#22d3ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                marginBottom: '1.25rem',
              }}
            >
              👩‍🎓
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Student Experience
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              Transparent visibility into attendance history:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>View all enrolled classes and subjects</li>
              <li>Inspect session-by-session PRESENT or ABSENT marks</li>
              <li>Check total class count, presents, and absences</li>
              <li>Real-time attendance percentage formula calculation</li>
              <li>Zero division safety guarantees and strict privacy</li>
            </ul>
          </div>

          {/* Architecture Card */}
          <div className="card" style={{ borderTop: '4px solid #10b981' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                marginBottom: '1.25rem',
              }}
            >
              🛡️
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Robust Security
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              Enterprise-grade backend principles:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Stateless JWT Authentication with Bearer tokens</li>
              <li>BCrypt password hashing algorithm</li>
              <li>Role-based URL security and server-side ownership guards</li>
              <li>Database unique constraints preventing duplicates</li>
              <li>Comprehensive Jakarta Validation on all endpoints</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

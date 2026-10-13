import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getAllSummaries();
        setSummaries(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your attendance summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  const totalClassesEnrolled = summaries.length;
  const totalConducted = summaries.reduce((acc, s) => acc + (s.totalClasses || 0), 0);
  const totalPresents = summaries.reduce((acc, s) => acc + (s.presentCount || 0), 0);
  const totalAbsents = summaries.reduce((acc, s) => acc + (s.absentCount || 0), 0);

  const overallPercentage = totalConducted > 0
    ? Number(((totalPresents / totalConducted) * 100).toFixed(1))
    : 0.0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name}</strong>. Here is your current attendance standing.
          </p>
        </div>

        <Link to="/student/attendance" className="btn btn-secondary">
          📜 View All Attendance Records
        </Link>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Top Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Enrolled Classes</span>
          <span className="stat-value">{totalClassesEnrolled}</span>
          <span className="stat-meta">Active courses</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Overall Attendance</span>
          <span className="stat-value" style={{ color: overallPercentage >= 75 ? '#34d399' : '#fb7185' }}>
            {overallPercentage}%
          </span>
          <span className="stat-meta">
            {overallPercentage >= 75 ? 'Safe standing (≥75%)' : 'Below 75% threshold'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Presents</span>
          <span className="stat-value" style={{ color: '#34d399' }}>{totalPresents}</span>
          <span className="stat-meta">Classes attended</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Absences</span>
          <span className="stat-value" style={{ color: '#fb7185' }}>{totalAbsents}</span>
          <span className="stat-meta">Classes missed</span>
        </div>
      </div>

      {/* Course Summaries Section */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Your Course Attendance Summaries</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {summaries.length} {summaries.length === 1 ? 'Course' : 'Courses'}
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating your attendance percentages..." />
      ) : summaries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No enrolled classes found
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto', fontSize: '0.925rem' }}>
            Ask your teachers to enroll you into their class using your registered email: <strong>{user?.email}</strong>.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {summaries.map((item) => (
            <div key={item.classId} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.className}
                </h3>
                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {item.subjectName}
                </p>
              </div>

              {/* Progress and percentage */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Attendance Rate</span>
                  <span
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: item.attendancePercentage >= 75 ? '#34d399' : '#fb7185',
                    }}
                  >
                    {item.attendancePercentage}%
                  </span>
                </div>
                <div className="progress-container">
                  <div
                    className={`progress-bar ${
                      item.attendancePercentage >= 75
                        ? 'high'
                        : item.attendancePercentage >= 50
                        ? 'medium'
                        : 'low'
                    }`}
                    style={{ width: `${item.attendancePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats breakdown */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.85rem 0',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Total Classes</span>
                  <strong style={{ fontSize: '1rem' }}>{item.totalClasses}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Present</span>
                  <strong style={{ fontSize: '1rem', color: '#34d399' }}>{item.presentCount}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Absent</span>
                  <strong style={{ fontSize: '1rem', color: '#fb7185' }}>{item.absentCount}</strong>
                </div>
              </div>

              <Link
                to={`/student/classes/${item.classId}/attendance`}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 'auto', width: '100%' }}
              >
                View Detailed Records &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

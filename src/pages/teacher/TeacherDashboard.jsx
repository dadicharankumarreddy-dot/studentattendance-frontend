import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import { useAuth } from '../../context/AuthContext';
import ClassCard from '../../components/ClassCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await teacherApi.getClasses();
      setClasses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const totalSessions = classes.reduce((sum, c) => sum + (c.sessionCount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name}</strong>. Here is your academic overview.
          </p>
        </div>
        <Link to="/teacher/classes/new" className="btn btn-primary">
          + Create New Class
        </Link>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Active Classes</span>
          <span className="stat-value">{totalClasses}</span>
          <span className="stat-meta">Created & managed by you</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Enrollments</span>
          <span className="stat-value">{totalStudents}</span>
          <span className="stat-meta">Active student seats</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sessions Conducted</span>
          <span className="stat-value">{totalSessions}</span>
          <span className="stat-meta">Attendance logged to date</span>
        </div>
      </div>

      {/* Class Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Your Classes</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing {classes.length} {classes.length === 1 ? 'class' : 'classes'}
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your teaching classes..." />
      ) : classes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No classes created yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem auto', fontSize: '0.925rem' }}>
            Get started by creating your first class. You can then enroll students by email and start tracking attendance sessions.
          </p>
          <Link to="/teacher/classes/new" className="btn btn-primary">
            + Create Class Now
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {classes.map((item) => (
            <ClassCard key={item.id} classItem={item} isTeacher={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;

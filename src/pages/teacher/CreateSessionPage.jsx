import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const CreateSessionPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const data = await teacherApi.getClassById(classId);
        setClassData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load class details');
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!attendanceDate) {
      setError('Please select an attendance date.');
      return;
    }

    try {
      setSubmitting(true);
      const session = await teacherApi.createSession(classId, attendanceDate);
      // Immediately navigate to the marking page for this session!
      navigate(`/teacher/attendance-sessions/${session.id}/mark`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create attendance session');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/teacher/classes/${classId}/attendance-sessions`} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Sessions
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Schedule Attendance Session
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.925rem' }}>
          Class: <strong>{classData?.className}</strong> ({classData?.subjectName})
        </p>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="attendanceDate">
              Session Date *
            </label>
            <input
              id="attendanceDate"
              type="date"
              className="form-input"
              max={todayStr}
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              required
            />
            <small style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Only one attendance session is permitted per class per date.
            </small>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Link to={`/teacher/classes/${classId}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="spinner"></span> : 'Create & Mark Attendance &rarr;'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;

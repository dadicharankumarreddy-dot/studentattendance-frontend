import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentApi } from '../../api/studentApi';
import AttendanceStatusBadge from '../../components/AttendanceStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const ClassAttendanceDetailsPage = () => {
  const { classId } = useParams();

  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sumRes, recRes] = await Promise.all([
          studentApi.getClassSummary(classId),
          studentApi.getClassAttendance(classId),
        ]);
        setSummary(sumRes);
        setRecords(recRes);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load class attendance records');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  if (loading) {
    return <LoadingSpinner message="Loading attendance breakdown..." />;
  }

  if (error) {
    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <Link to="/student/dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            &larr; Back to Dashboard
          </Link>
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/student/dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{summary?.className}</h1>
          <p className="page-subtitle">
            Subject: <strong>{summary?.subjectName}</strong> &bull; Attendance Breakdown
          </p>
        </div>
      </div>

      {/* Summary Stat Card */}
      {summary && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="stat-label">Total Sessions</span>
              <div className="stat-value">{summary.totalClasses}</div>
            </div>
            <div>
              <span className="stat-label">Presents</span>
              <div className="stat-value" style={{ color: '#34d399' }}>{summary.presentCount}</div>
            </div>
            <div>
              <span className="stat-label">Absences</span>
              <div className="stat-value" style={{ color: '#fb7185' }}>{summary.absentCount}</div>
            </div>
            <div>
              <span className="stat-label">Attendance Rate</span>
              <div className="stat-value" style={{ color: summary.attendancePercentage >= 75 ? '#34d399' : '#fb7185' }}>
                {summary.attendancePercentage}%
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Progress towards 75% required threshold</span>
              <span>{summary.attendancePercentage}% / 100%</span>
            </div>
            <div className="progress-container">
              <div
                className={`progress-bar ${
                  summary.attendancePercentage >= 75
                    ? 'high'
                    : summary.attendancePercentage >= 50
                    ? 'medium'
                    : 'low'
                }`}
                style={{ width: `${summary.attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Session-by-Session Records ({records.length})
          </h3>
        </div>

        {records.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No attendance records logged for you in this class yet.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Session ID</th>
                <th>Status</th>
                <th>Marked Time</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={rec.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td>
                    <span className="badge badge-code">SESS-{rec.sessionId}</span>
                  </td>
                  <td>
                    <AttendanceStatusBadge status={rec.status} />
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {rec.markedAt ? new Date(rec.markedAt).toLocaleString() : 'N/A'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {rec.updatedAt ? new Date(rec.updatedAt).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClassAttendanceDetailsPage;

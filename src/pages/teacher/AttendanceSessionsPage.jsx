import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AttendanceSessionsPage = () => {
  const { classId } = useParams();

  const [classData, setClassData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [classRes, sessionsRes] = await Promise.all([
        teacherApi.getClassById(classId),
        teacherApi.getSessions(classId),
      ]);
      setClassData(classRes);
      setSessions(sessionsRes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  if (loading) {
    return <LoadingSpinner message="Loading attendance history..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to={`/teacher/classes/${classId}`} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Class Details
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Sessions</h1>
          <p className="page-subtitle">
            Class: <strong>{classData?.className}</strong> ({classData?.subjectName}) | Code: <code>{classData?.classCode}</code>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/teacher/classes/${classId}/attendance-report`} className="btn btn-secondary">
            📊 Student Attendance Report
          </Link>
          <Link to={`/teacher/classes/${classId}/attendance-sessions/new`} className="btn btn-primary">
            + Schedule Session
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="table-container">
        {sessions.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No attendance sessions recorded yet for this class.</p>
            <Link to={`/teacher/classes/${classId}/attendance-sessions/new`} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Create First Attendance Session
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Session Date</th>
                <th>Enrolled Students</th>
                <th>Presents</th>
                <th>Absences</th>
                <th>Attendance Rate</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((sess) => {
                const totalMarks = sess.presentCount + sess.absentCount;
                const rate = totalMarks > 0 ? ((sess.presentCount / totalMarks) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={sess.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {sess.attendanceDate}
                    </td>
                    <td>{sess.totalEnrolled}</td>
                    <td>
                      <span className="badge badge-present">{sess.presentCount} Present</span>
                    </td>
                    <td>
                      <span className="badge badge-absent">{sess.absentCount} Absent</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rate}%</span>
                        <div className="progress-container" style={{ width: '80px', marginTop: 0 }}>
                          <div
                            className={`progress-bar ${rate >= 75 ? 'high' : rate >= 50 ? 'medium' : 'low'}`}
                            style={{ width: `${rate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/teacher/attendance-sessions/${sess.id}/mark`}
                        className="btn btn-secondary btn-sm"
                      >
                        Mark / Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceSessionsPage;

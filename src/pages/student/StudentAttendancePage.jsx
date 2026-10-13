import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api/studentApi';
import AttendanceStatusBadge from '../../components/AttendanceStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const StudentAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [classes, setClasses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recs, clsList] = await Promise.all([
          studentApi.getAllAttendance(),
          studentApi.getClasses(),
        ]);

        const classMap = {};
        clsList.forEach((c) => {
          classMap[c.id] = c;
        });

        setClasses(classMap);
        setRecords(recs);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance logs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your attendance history..." />;
  }

  const presentsCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentsCount = records.filter((r) => r.status === 'ABSENT').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Attendance History</h1>
          <p className="page-subtitle">Full log of your attendance records across all courses</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-present" style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem' }}>
            {presentsCount} Total Presents
          </span>
          <span className="badge badge-absent" style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem' }}>
            {absentsCount} Total Absences
          </span>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="table-container">
        {records.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No attendance records logged yet.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Course Class</th>
                <th>Session Ref</th>
                <th>Status</th>
                <th>Marked Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => {
                const classInfo = classes[rec.classId];

                return (
                  <tr key={rec.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <strong style={{ display: 'block', color: 'var(--text-primary)' }}>
                        {classInfo?.className || `Class #${rec.classId}`}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {classInfo?.subjectName || ''}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-code">SESS-{rec.sessionId}</span>
                    </td>
                    <td>
                      <AttendanceStatusBadge status={rec.status} />
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {rec.markedAt ? new Date(rec.markedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td>
                      {rec.classId && (
                        <Link
                          to={`/student/classes/${rec.classId}/attendance`}
                          className="btn btn-secondary btn-sm"
                        >
                          View Class Details
                        </Link>
                      )}
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

export default StudentAttendancePage;

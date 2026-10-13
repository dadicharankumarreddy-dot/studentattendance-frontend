import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AttendanceReportPage = () => {
  const { classId } = useParams();

  const [classData, setClassData] = useState(null);
  const [report, setReport] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateReport = async () => {
      try {
        setLoading(true);
        const [cls, students, sessions] = await Promise.all([
          teacherApi.getClassById(classId),
          teacherApi.getStudents(classId),
          teacherApi.getSessions(classId),
        ]);

        setClassData(cls);
        setTotalSessions(sessions.length);

        // Map student metrics across all sessions
        const studentStats = students.map((st) => {
          let presents = 0;
          let absents = 0;

          sessions.forEach((sess) => {
            const record = (sess.records || []).find((r) => r.studentId === st.studentId);
            if (record) {
              if (record.status === 'PRESENT') presents++;
              else if (record.status === 'ABSENT') absents++;
            }
          });

          const total = sessions.length;
          const percentage = total > 0 ? Number(((presents / total) * 100).toFixed(1)) : 0.0;

          return {
            studentId: st.studentId,
            studentName: st.studentName,
            studentEmail: st.studentEmail,
            totalClasses: total,
            presents,
            absents,
            percentage,
          };
        });

        setReport(studentStats);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to generate attendance report');
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [classId]);

  if (loading) {
    return <LoadingSpinner message="Generating class attendance report..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to={`/teacher/classes/${classId}/attendance-sessions`} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Sessions
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Class Attendance Report</h1>
          <p className="page-subtitle">
            Class: <strong>{classData?.className}</strong> ({classData?.subjectName}) | Total Sessions Conducted: <strong>{totalSessions}</strong>
          </p>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="table-container">
        {report.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No students enrolled to display reports for.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Email Address</th>
                <th>Total Sessions</th>
                <th>Presents</th>
                <th>Absences</th>
                <th>Attendance %</th>
                <th>Standing</th>
              </tr>
            </thead>
            <tbody>
              {report.map((item, idx) => (
                <tr key={item.studentId}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{item.studentName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.studentEmail}</td>
                  <td>{item.totalClasses}</td>
                  <td>
                    <span className="badge badge-present">{item.presents}</span>
                  </td>
                  <td>
                    <span className="badge badge-absent">{item.absents}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {item.percentage}%
                      </span>
                      <div className="progress-container" style={{ width: '70px', marginTop: 0 }}>
                        <div
                          className={`progress-bar ${item.percentage >= 75 ? 'high' : item.percentage >= 50 ? 'medium' : 'low'}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.percentage >= 75 ? (
                      <span className="badge badge-present">ELIGIBLE (&ge;75%)</span>
                    ) : (
                      <span className="badge badge-absent">LOW ATTENDANCE</span>
                    )}
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

export default AttendanceReportPage;

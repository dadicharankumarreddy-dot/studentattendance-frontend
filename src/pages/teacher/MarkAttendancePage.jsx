import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';

const MarkAttendancePage = () => {
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const sessionData = await teacherApi.getSessionDetails(sessionId);
      setSession(sessionData);

      // Get enrolled students for this class
      const studentsData = await teacherApi.getStudents(sessionData.classId);
      setStudents(studentsData);

      // Build map from existing records or default to PRESENT
      const map = {};
      const existingRecordsMap = {};
      (sessionData.records || []).forEach((r) => {
        existingRecordsMap[r.studentId] = r.status;
      });

      studentsData.forEach((s) => {
        map[s.studentId] = existingRecordsMap[s.studentId] || 'PRESENT';
      });

      setAttendanceMap(map);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const setStatusForStudent = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.studentId] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    setError('');
    setSuccess('');

    if (students.length === 0) {
      setError('Cannot record attendance: No students enrolled in this class.');
      return;
    }

    const records = students.map((s) => ({
      studentId: s.studentId,
      status: attendanceMap[s.studentId] || 'PRESENT',
    }));

    try {
      setSaving(true);
      const updatedSession = await teacherApi.updateAttendance(sessionId, records);
      setSession(updatedSession);
      setSuccess('Attendance records saved and updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading attendance session..." />;
  }

  if (!session) {
    return <ErrorMessage message="Attendance session not found" />;
  }

  const presentTotal = Object.values(attendanceMap).filter((st) => st === 'PRESENT').length;
  const absentTotal = Object.values(attendanceMap).filter((st) => st === 'ABSENT').length;

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to={`/teacher/classes/${session.classId}/attendance-sessions`} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Sessions List
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-subtitle">
            Class: <strong>{session.className}</strong> | Session Date: <strong style={{ color: 'var(--primary)' }}>{session.attendanceDate}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={handleSaveAttendance}
            className="btn btn-primary"
            disabled={saving || students.length === 0}
          >
            {saving ? <span className="spinner"></span> : '💾 Save Attendance Records'}
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />
      <SuccessMessage message={success} onDismiss={() => setSuccess('')} />

      {/* Control bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Summary Preview</span>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>
              <span style={{ color: '#34d399' }}>{presentTotal} Present</span> &bull;{' '}
              <span style={{ color: '#fb7185' }}>{absentTotal} Absent</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => handleMarkAll('PRESENT')}
            className="btn btn-secondary btn-sm"
          >
            ✅ Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('ABSENT')}
            className="btn btn-secondary btn-sm"
          >
            ❌ Mark All Absent
          </button>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="table-container">
        {students.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No students enrolled in this class.</p>
            <Link to={`/teacher/classes/${session.classId}/students`} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Enroll Students First
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Email Address</th>
                <th style={{ textAlign: 'center' }}>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => {
                const currentStatus = attendanceMap[student.studentId] || 'PRESENT';
                const isPresent = currentStatus === 'PRESENT';

                return (
                  <tr key={student.studentId}>
                    <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{student.studentName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{student.studentEmail}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-input)',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setStatusForStudent(student.studentId, 'PRESENT')}
                          style={{
                            padding: '0.45rem 1rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            background: isPresent ? 'var(--success)' : 'transparent',
                            color: isPresent ? '#ffffff' : 'var(--text-muted)',
                            transition: 'var(--transition)',
                          }}
                        >
                          PRESENT
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusForStudent(student.studentId, 'ABSENT')}
                          style={{
                            padding: '0.45rem 1rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            background: !isPresent ? 'var(--danger)' : 'transparent',
                            color: !isPresent ? '#ffffff' : 'var(--text-muted)',
                            transition: 'var(--transition)',
                          }}
                        >
                          ABSENT
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {students.length > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSaveAttendance}
            className="btn btn-primary"
            disabled={saving}
            style={{ padding: '0.8rem 2rem' }}
          >
            {saving ? <span className="spinner"></span> : '💾 Save & Update Attendance'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkAttendancePage;

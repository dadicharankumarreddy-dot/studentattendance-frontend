import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const ClassDetailsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classRes, studentsRes, sessionsRes] = await Promise.all([
        teacherApi.getClassById(classId),
        teacherApi.getStudents(classId),
        teacherApi.getSessions(classId),
      ]);
      setClassData(classRes);
      setStudents(studentsRes);
      setSessions(sessionsRes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  const handleDeleteClass = async () => {
    try {
      setIsDeleting(true);
      await teacherApi.deleteClass(classId);
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete class');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading class information..." />;
  }

  if (!classData) {
    return <ErrorMessage message="Class not found or access denied." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/teacher/dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />
      <SuccessMessage message={success} onDismiss={() => setSuccess('')} />

      {/* Class Header Banner */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(19, 27, 46, 0.95))',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-code" style={{ fontSize: '0.85rem' }}>
              CODE: {classData.classCode}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {classData.className}
            </h1>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.05rem', marginTop: '0.2rem' }}>
              {classData.subjectName}
            </p>
            {classData.description && (
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.65rem', maxWidth: '700px', fontSize: '0.925rem' }}>
                {classData.description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Link to={`/teacher/classes/${classId}/edit`} className="btn btn-secondary btn-sm">
              ✏️ Edit Class
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-danger btn-sm"
            >
              🗑️ Delete Class
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
              {students.length}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Enrolled Students</span>
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
              {sessions.length}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Attendance Sessions</span>
          </div>
        </div>
      </div>

      {/* Action Shortcut Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <Link to={`/teacher/classes/${classId}/attendance-sessions/new`} className="btn btn-primary">
          + New Attendance Session
        </Link>
        <Link to={`/teacher/classes/${classId}/students`} className="btn btn-secondary">
          👥 Manage Students ({students.length})
        </Link>
        <Link to={`/teacher/classes/${classId}/attendance-sessions`} className="btn btn-secondary">
          📅 All Sessions ({sessions.length})
        </Link>
      </div>

      {/* Two Column Grid for Students & Recent Sessions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        {/* Enrolled Students Panel */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Enrolled Students</h2>
            <Link to={`/teacher/classes/${classId}/students`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Manage &rarr;
            </Link>
          </div>

          {students.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              No students enrolled yet. Add students using their registered email.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {students.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{s.studentName}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.studentEmail}</span>
                  </div>
                </div>
              ))}
              {students.length > 5 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>
                  +{students.length - 5} more students
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent Attendance Sessions Panel */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Sessions</h2>
            <Link to={`/teacher/classes/${classId}/attendance-sessions`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          {sessions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              No attendance sessions conducted yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {sessions.slice(0, 5).map((sess) => (
                <div
                  key={sess.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                      {sess.attendanceDate}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Present: {sess.presentCount} | Absent: {sess.absentCount}
                    </span>
                  </div>
                  <Link
                    to={`/teacher/attendance-sessions/${sess.id}/mark`}
                    className="btn btn-secondary btn-sm"
                  >
                    Mark / Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteModal}
        title="Delete Class"
        message={`Are you sure you want to delete class "${classData.className}"? This will permanently remove all enrollments and attendance records.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
        isDanger={true}
        onConfirm={handleDeleteClass}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ClassDetailsPage;

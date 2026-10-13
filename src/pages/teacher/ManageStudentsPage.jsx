import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const ManageStudentsPage = () => {
  const { classId } = useParams();

  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [studentToRemove, setStudentToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classRes, studentsRes] = await Promise.all([
        teacherApi.getClassById(classId),
        teacherApi.getStudents(classId),
      ]);
      setClassData(classRes);
      setStudents(studentsRes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load enrolled students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!studentEmail.trim()) {
      setError('Please enter a student email.');
      return;
    }

    try {
      setEnrolling(true);
      const newEnrollment = await teacherApi.enrollStudent(classId, studentEmail.trim());
      setSuccess(`Student '${newEnrollment.studentName}' (${newEnrollment.studentEmail}) enrolled successfully!`);
      setStudentEmail('');
      // Reload students
      const updated = await teacherApi.getStudents(classId);
      setStudents(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll student');
    } finally {
      setEnrolling(false);
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;

    try {
      setRemoving(true);
      await teacherApi.removeStudent(classId, studentToRemove.studentId);
      setSuccess(`Student '${studentToRemove.studentName}' removed from class.`);
      setStudents(students.filter((s) => s.studentId !== studentToRemove.studentId));
      setStudentToRemove(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove student');
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading student roster..." />;
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
          <h1 className="page-title">Manage Enrolled Students</h1>
          <p className="page-subtitle">
            Class: <strong>{classData?.className}</strong> ({classData?.subjectName}) | Code: <code>{classData?.classCode}</code>
          </p>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />
      <SuccessMessage message={success} onDismiss={() => setSuccess('')} />

      {/* Enroll Form Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Enroll Registered Student
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Enter the registered email of the student. They must already have an account with the role <code>STUDENT</code>.
        </p>

        <form onSubmit={handleEnroll} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="email"
            className="form-input"
            style={{ flex: 1, minWidth: '260px' }}
            placeholder="student@example.com"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={enrolling}>
            {enrolling ? <span className="spinner"></span> : '+ Enroll Student'}
          </button>
        </form>
      </div>

      {/* Enrolled Students Table */}
      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            Enrolled Student Roster ({students.length})
          </h3>
        </div>

        {students.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No students currently enrolled in this class. Use the form above to enroll students.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Email Address</th>
                <th>Enrolled Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student.id || student.studentId}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{student.studentName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{student.studentEmail}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setStudentToRemove(student)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmationDialog
        isOpen={Boolean(studentToRemove)}
        title="Remove Student"
        message={`Are you sure you want to remove ${studentToRemove?.studentName} (${studentToRemove?.studentEmail}) from this class?`}
        confirmText={removing ? 'Removing...' : 'Remove Student'}
        isDanger={true}
        onConfirm={handleRemoveStudent}
        onCancel={() => setStudentToRemove(null)}
      />
    </div>
  );
};

export default ManageStudentsPage;

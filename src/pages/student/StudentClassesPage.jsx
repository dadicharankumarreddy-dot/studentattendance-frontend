import React, { useEffect, useState } from 'react';
import { studentApi } from '../../api/studentApi';
import ClassCard from '../../components/ClassCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const StudentClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getClasses();
        setClasses(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your enrolled classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your enrolled classes..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enrolled Classes</h1>
          <p className="page-subtitle">Courses you are currently registered in</p>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {classes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Not enrolled in any class yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto', fontSize: '0.925rem' }}>
            Provide your email address to your teacher so they can enroll you into their class roster.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {classes.map((cls) => (
            <ClassCard key={cls.id} classItem={cls} isTeacher={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentClassesPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const EditClassPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const data = await teacherApi.getClassById(classId);
        setClassName(data.className);
        setSubjectName(data.subjectName);
        setDescription(data.description || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch class details');
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!className.trim() || !subjectName.trim()) {
      setError('Please provide both Class Name and Subject Name.');
      return;
    }

    try {
      setSaving(true);
      await teacherApi.updateClass(classId, {
        className: className.trim(),
        subjectName: subjectName.trim(),
        description: description.trim() || null,
      });

      navigate(`/teacher/classes/${classId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update class');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading class details..." />;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/teacher/classes/${classId}`} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Class Details
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Edit Class Details
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.925rem' }}>
          Update class name, subject title, or description.
        </p>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="className">
              Class Name / Section *
            </label>
            <input
              id="className"
              type="text"
              className="form-input"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="subjectName">
              Subject Name *
            </label>
            <input
              id="subjectName"
              type="text"
              className="form-input"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="description">
              Description (Optional)
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Link to={`/teacher/classes/${classId}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner"></span> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClassPage;

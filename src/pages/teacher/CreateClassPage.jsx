import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { teacherApi } from '../../api/teacherApi';
import ErrorMessage from '../../components/ErrorMessage';

const CreateClassPage = () => {
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!className.trim() || !subjectName.trim()) {
      setError('Please provide both Class Name and Subject Name.');
      return;
    }

    try {
      setLoading(true);
      const newClass = await teacherApi.createClass({
        className: className.trim(),
        subjectName: subjectName.trim(),
        description: description.trim() || null,
      });

      navigate(`/teacher/classes/${newClass.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/teacher/dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Create New Class
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.925rem' }}>
          Define the class details. A unique class code will be generated automatically.
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
              placeholder="e.g. CSE-A, Batch 2026, Section B"
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
              placeholder="e.g. Java Full Stack Development, Data Structures"
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
              placeholder="Brief course objectives, schedule or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Link to="/teacher/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassPage;

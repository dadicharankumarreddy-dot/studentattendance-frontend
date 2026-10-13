import React from 'react';
import { Link } from 'react-router-dom';

const ClassCard = ({ classItem, isTeacher = false, onDelete }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span className="badge badge-code">{classItem.classCode}</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
            {classItem.className}
          </h3>
          <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.15rem' }}>
            {classItem.subjectName}
          </p>
        </div>
      </div>

      {classItem.description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', flex: 1 }}>
          {classItem.description}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          padding: '0.85rem 0',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          margin: '0.75rem 0 1.25rem 0',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
        }}
      >
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', display: 'block' }}>
            {classItem.studentCount}
          </span>
          <span>Students</span>
        </div>
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', display: 'block' }}>
            {classItem.sessionCount}
          </span>
          <span>Sessions</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' }}>
        {isTeacher ? (
          <>
            <Link to={`/teacher/classes/${classItem.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Manage
            </Link>
            <Link to={`/teacher/classes/${classItem.id}/attendance-sessions`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              Attendance
            </Link>
          </>
        ) : (
          <Link to={`/student/classes/${classItem.id}/attendance`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            View Attendance Records
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClassCard;

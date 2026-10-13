import React from 'react';

const AttendanceStatusBadge = ({ status }) => {
  if (!status) {
    return <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>UNMARKED</span>;
  }

  const isPresent = status === 'PRESENT';

  return (
    <span className={`badge ${isPresent ? 'badge-present' : 'badge-absent'}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isPresent ? '#10b981' : '#f43f5e',
          display: 'inline-block',
        }}
      ></span>
      {status}
    </span>
  );
};

export default AttendanceStatusBadge;

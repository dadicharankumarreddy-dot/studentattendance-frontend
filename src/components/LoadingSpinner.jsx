import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  return (
    <div className="center-spinner">
      <div className={`spinner ${size === 'large' ? 'spinner-large' : ''}`}></div>
      {message && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

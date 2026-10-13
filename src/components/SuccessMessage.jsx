import React from 'react';

const SuccessMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="alert alert-success" role="status">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '1.1rem',
            lineHeight: 1,
            padding: '0 4px',
          }}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;

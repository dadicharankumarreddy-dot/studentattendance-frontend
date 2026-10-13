import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} <strong>Student Attendance Management System</strong>. Simple, secure, role-based.
        </p>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Built with Spring Boot 3, React, Vite & MySQL 8
        </p>
      </div>
    </footer>
  );
};

export default Footer;

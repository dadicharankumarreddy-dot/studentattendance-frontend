import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isTeacher, isStudent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-wrapper">
        <Link to="/" className="nav-brand">
          <div className="nav-logo-icon">A</div>
          <span>AttendancePortal</span>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              {isTeacher && (
                <>
                  <NavLink to="/teacher/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                  <NavLink to="/teacher/classes" className="nav-link">
                    My Classes
                  </NavLink>
                  <NavLink to="/teacher/classes/new" className="nav-link">
                    + Create Class
                  </NavLink>
                </>
              )}

              {isStudent && (
                <>
                  <NavLink to="/student/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                  <NavLink to="/student/classes" className="nav-link">
                    Enrolled Classes
                  </NavLink>
                  <NavLink to="/student/attendance" className="nav-link">
                    Attendance History
                  </NavLink>
                </>
              )}

              <div className="user-badge">
                <span style={{ fontWeight: 600 }}>{user?.name}</span>
                <span className={`role-pill ${isTeacher ? 'teacher' : 'student'}`}>
                  {user?.role}
                </span>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" id="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoleRoute from './components/RoleRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateClassPage from './pages/teacher/CreateClassPage';
import EditClassPage from './pages/teacher/EditClassPage';
import ClassDetailsPage from './pages/teacher/ClassDetailsPage';
import ManageStudentsPage from './pages/teacher/ManageStudentsPage';
import CreateSessionPage from './pages/teacher/CreateSessionPage';
import MarkAttendancePage from './pages/teacher/MarkAttendancePage';
import AttendanceSessionsPage from './pages/teacher/AttendanceSessionsPage';
import AttendanceReportPage from './pages/teacher/AttendanceReportPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentClassesPage from './pages/student/StudentClassesPage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';
import ClassAttendanceDetailsPage from './pages/student/ClassAttendanceDetailsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Teacher Protected Routes */}
              <Route
                path="/teacher/dashboard"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <TeacherDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/classes"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <TeacherDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/classes/new"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <CreateClassPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/classes/:classId"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <ClassDetailsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/classes/:classId/edit"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <EditClassPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/classes/:classId/students"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <ManageStudentsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/classes/:classId/attendance-sessions"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <AttendanceSessionsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/classes/:classId/attendance-sessions/new"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <CreateSessionPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/classes/:classId/attendance-report"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <AttendanceReportPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/attendance-sessions/:sessionId/mark"
                element={
                  <RoleRoute requiredRole="TEACHER">
                    <MarkAttendancePage />
                  </RoleRoute>
                }
              />

              {/* Student Protected Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <RoleRoute requiredRole="STUDENT">
                    <StudentDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/student/classes"
                element={
                  <RoleRoute requiredRole="STUDENT">
                    <StudentClassesPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/student/attendance"
                element={
                  <RoleRoute requiredRole="STUDENT">
                    <StudentAttendancePage />
                  </RoleRoute>
                }
              />
              <Route
                path="/student/classes/:classId/attendance"
                element={
                  <RoleRoute requiredRole="STUDENT">
                    <ClassAttendanceDetailsPage />
                  </RoleRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

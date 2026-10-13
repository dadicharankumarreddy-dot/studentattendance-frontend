import axiosClient from './axiosClient';

export const teacherApi = {
  getClasses: async () => {
    const res = await axiosClient.get('/api/teacher/classes');
    return res.data;
  },

  createClass: async (data) => {
    const res = await axiosClient.post('/api/teacher/classes', data);
    return res.data;
  },

  getClassById: async (classId) => {
    const res = await axiosClient.get(`/api/teacher/classes/${classId}`);
    return res.data;
  },

  updateClass: async (classId, data) => {
    const res = await axiosClient.put(`/api/teacher/classes/${classId}`, data);
    return res.data;
  },

  deleteClass: async (classId) => {
    const res = await axiosClient.delete(`/api/teacher/classes/${classId}`);
    return res.data;
  },

  // Student Enrollment
  getStudents: async (classId) => {
    const res = await axiosClient.get(`/api/teacher/classes/${classId}/students`);
    return res.data;
  },

  enrollStudent: async (classId, studentEmail) => {
    const res = await axiosClient.post(`/api/teacher/classes/${classId}/students`, {
      studentEmail,
    });
    return res.data;
  },

  removeStudent: async (classId, studentId) => {
    const res = await axiosClient.delete(`/api/teacher/classes/${classId}/students/${studentId}`);
    return res.data;
  },

  // Attendance Sessions
  createSession: async (classId, attendanceDate) => {
    const res = await axiosClient.post(`/api/teacher/classes/${classId}/attendance-sessions`, {
      attendanceDate,
    });
    return res.data;
  },

  getSessions: async (classId) => {
    const res = await axiosClient.get(`/api/teacher/classes/${classId}/attendance-sessions`);
    return res.data;
  },

  getSessionDetails: async (sessionId) => {
    const res = await axiosClient.get(`/api/teacher/attendance-sessions/${sessionId}`);
    return res.data;
  },

  updateAttendance: async (sessionId, records) => {
    const res = await axiosClient.put(`/api/teacher/attendance-sessions/${sessionId}/records`, {
      records,
    });
    return res.data;
  },
};

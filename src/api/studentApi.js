import axiosClient from './axiosClient';

export const studentApi = {
  getClasses: async () => {
    const res = await axiosClient.get('/api/student/classes');
    return res.data;
  },

  getClassAttendance: async (classId) => {
    const res = await axiosClient.get(`/api/student/classes/${classId}/attendance`);
    return res.data;
  },

  getClassSummary: async (classId) => {
    const res = await axiosClient.get(`/api/student/classes/${classId}/summary`);
    return res.data;
  },

  getAllAttendance: async () => {
    const res = await axiosClient.get('/api/student/attendance');
    return res.data;
  },

  getAllSummaries: async () => {
    const res = await axiosClient.get('/api/student/summaries');
    return res.data;
  },
};

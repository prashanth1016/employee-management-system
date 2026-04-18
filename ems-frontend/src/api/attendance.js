// src/api/attendance.js
import axiosInstance from './axiosInstance';

export const getCurrentStatus = async () => {
  const response = await axiosInstance.get('/attendance/current-status');
  return response.data;
};

export const getDailyAttendance = async (date) => {
  const response = await axiosInstance.get(`/attendance/daily/${date}`);
  return response.data;
};

export const getEmployeeSessions = async (employeeId) => {
  const response = await axiosInstance.get(`/attendance/employee/${employeeId}/sessions`);
  return response.data;
};
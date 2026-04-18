import axiosInstance from './axiosInstance';

export const createLeaveRequest = async (leaveData) => {
  const response = await axiosInstance.post('/leave-requests/', leaveData);
  return response.data;
};

export const getMyLeaveRequests = async () => {
  const response = await axiosInstance.get('/leave-requests/my');
  return response.data;
};

export const getAllLeaveRequests = async () => {
  const response = await axiosInstance.get('/leave-requests/');
  return response.data;
};

export const updateLeaveStatus = async (leaveId, status, adminRemark) => {
  const response = await axiosInstance.put(`/leave-requests/${leaveId}`, { status, admin_remark: adminRemark });
  return response.data;
};
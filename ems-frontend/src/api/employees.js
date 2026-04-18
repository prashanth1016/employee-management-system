import axiosInstance from './axiosInstance';

export const getEmployees = async () => {
  const response = await axiosInstance.get('/employees/');
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await axiosInstance.post('/employees/', employeeData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axiosInstance.delete(`/employees/${id}/`);
  return response.data;
};

export const getEmployeeByUserId = async (userId) => {
  const response = await axiosInstance.get(`/employees/user/${userId}/`);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await axiosInstance.get('/employees/profile');
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const formData = new URLSearchParams();
  formData.append('old_password', oldPassword);
  formData.append('new_password', newPassword);
  const response = await axiosInstance.post('/employees/change-password', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const uploadProfilePic = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post('/employees/upload-profile-pic', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
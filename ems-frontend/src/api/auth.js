import axiosInstance from './axiosInstance';

export const login = async (identifier, password) => {
  const response = await axiosInstance.post('/auth/login', { email: identifier, password });
  return response.data;
};

export const resetUserPassword = async (userId, newPassword) => {
  const response = await axiosInstance.post('/auth/admin/reset-password', null, {
    params: { user_id: userId, new_password: newPassword }
  });
  return response.data;
};
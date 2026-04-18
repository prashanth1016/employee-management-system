import axiosInstance from './axiosInstance';

export const assignTask = async (taskData) => {
  const response = await axiosInstance.post('/tasks/', taskData);
  return response.data;
};

export const getMyTasks = async () => {
  const response = await axiosInstance.get('/tasks/my');
  return response.data;
};

export const getAllTasks = async () => {
  const response = await axiosInstance.get('/tasks/');
  return response.data;
};

export const completeTask = async (taskId, notes, attachment) => {
  const formData = new FormData();
  formData.append('notes', notes);
  if (attachment) {
    formData.append('attachment', attachment);
  }
  const response = await axiosInstance.post(`/tasks/${taskId}/complete`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
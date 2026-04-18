import axiosInstance from './axiosInstance';

export const uploadDocument = async (userId, fileType, file) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('file_type', fileType);
  formData.append('file', file);
  const response = await axiosInstance.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getMyDocuments = async () => {
  const response = await axiosInstance.get('/documents/my');
  return response.data;
};
export const getDocumentsByEmployee = async (employeeId) => {
  const response = await axiosInstance.get(`/documents/${employeeId}`);
  return response.data;
};

export const deleteDocument = async (docId) => {
  const response = await axiosInstance.delete(`/documents/${docId}`);
  return response.data;
};
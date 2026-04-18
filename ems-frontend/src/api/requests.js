// src/api/requests.js
import axiosInstance from './axiosInstance';

export const getRequests = async () => {
  const response = await axiosInstance.get('/requests/');
  return response.data;
};

export const getMyRequests = async () => {
  const response = await axiosInstance.get('/requests/my');
  return response.data;
};

export const createRequest = async (data) => {
  const response = await axiosInstance.post('/requests/', data);
  return response.data;
};

export const updateRequestStatus = async (id, data) => {
  const response = await axiosInstance.put(`/requests/${id}`, data);
  return response.data;
};

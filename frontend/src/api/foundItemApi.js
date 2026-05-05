// frontend/src/api/foundItemApi.js
import axiosInstance from './axiosInstance';

export const getMyFoundItems = (params) => axiosInstance.get('/found-items/my', { params });
export const getFoundItems = (params) => axiosInstance.get('/found-items', { params });
export const getFoundItem = (id) => axiosInstance.get(`/found-items/${id}`);
export const createFoundItem = (formData) => axiosInstance.post('/found-items', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateFoundItem = (id, formData) => axiosInstance.put(`/found-items/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteFoundItem = (id) => axiosInstance.delete(`/found-items/${id}`);

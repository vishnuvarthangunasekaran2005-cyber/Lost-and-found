// frontend/src/api/lostItemApi.js
import axiosInstance from './axiosInstance';

export const getLostItems = (params) => axiosInstance.get('/lost-items', { params });
export const getLostItem = (id) => axiosInstance.get(`/lost-items/${id}`);
export const createLostItem = (formData) => axiosInstance.post('/lost-items', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateLostItem = (id, formData) => axiosInstance.put(`/lost-items/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteLostItem = (id) => axiosInstance.delete(`/lost-items/${id}`);
export const getLostItemMatches = (id) => axiosInstance.get(`/lost-items/${id}/matches`);

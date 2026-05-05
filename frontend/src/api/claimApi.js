// frontend/src/api/claimApi.js
import axiosInstance from './axiosInstance';

export const createClaim = (formData) => axiosInstance.post('/claims', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getMyClaims = (params) => axiosInstance.get('/claims/my', { params });
export const getClaim = (id) => axiosInstance.get(`/claims/${id}`);
export const getClaimsForItem = (foundItemId) => axiosInstance.get(`/claims/for-item/${foundItemId}`);
export const approveClaim = (id, note) => axiosInstance.put(`/claims/${id}/approve`, { note });
export const rejectClaim = (id, note) => axiosInstance.put(`/claims/${id}/reject`, { note });

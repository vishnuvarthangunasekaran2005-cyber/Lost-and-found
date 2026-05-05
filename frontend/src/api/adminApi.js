// frontend/src/api/adminApi.js
import axiosInstance from './axiosInstance';

export const getStats = () => axiosInstance.get('/admin/stats');
export const getUsers = (params) => axiosInstance.get('/admin/users', { params });
export const updateUserRole = (id, role) => axiosInstance.put(`/admin/users/${id}/role`, { role });
export const getPendingItems = (params) => axiosInstance.get('/admin/items/pending', { params });
export const approveItem = (id, type) => axiosInstance.put(`/admin/items/${id}/approve`, null, { params: { type } });
export const rejectItem = (id, type) => axiosInstance.put(`/admin/items/${id}/reject`, null, { params: { type } });
export const getNotifications = (params) => axiosInstance.get('/notifications/my', { params });
export const markNotificationRead = (id) => axiosInstance.put(`/notifications/${id}/read`);

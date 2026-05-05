// frontend/src/api/authApi.js
import axiosInstance from './axiosInstance';

export const login = (data) => axiosInstance.post('/auth/login', data);
export const register = (data) => axiosInstance.post('/auth/register', data);
export const refresh = (refreshToken) => axiosInstance.post('/auth/refresh', { refreshToken });
export const getMe = () => axiosInstance.get('/auth/me');

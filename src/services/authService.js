import api from '../api';

export const registerUser = (data) => api.post('/user/auth/register/', data);
export const loginUser = (data) => api.post('/user/auth/login/', data);
export const validateToken = (data) => api.post('/user/auth/validate/', data);
export const refreshToken = (data) => api.post('/user/auth/refresh-token/', data);
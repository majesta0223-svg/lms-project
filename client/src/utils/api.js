// utils/api.js
// Axios тохиргоо — backend-тэй ярилцах туслах

import axios from 'axios';

// Суурь URL — /api гэж бичвэл package.json-н proxy ашиглан
// автоматаар http://localhost:5000/api болно
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Хүсэлт явуулахаас ӨМНӨ JWT токенийг автоматаар нэмнэ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 алдаа (нэвтрэлт хүчингүй) гарвал нэвтрэх хуудас руу буцаана
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',  // आपके backend की root path
});

// 🔐 Interceptor: हर request से पहले token attach करेगा
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

import axios from 'axios';

const getBaseURL = () => {
  // Dev: relative path use karo taaki proxy + prod dono me /api correctly resolve ho.
  if (process.env.NODE_ENV === 'development') {
    return '/api';
  }

  // Prod: REACT_APP_API_URL me origin do (e.g. http://localhost:5000 or https://domain.com)
  // Agar /api already end karta ho to double prefix avoid.
  const apiUrl = process.env.REACT_APP_API_URL || '';
  if (!apiUrl) return '/api';

  return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
};




const instance = axios.create({
  baseURL: getBaseURL(),
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

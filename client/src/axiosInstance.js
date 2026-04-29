import axios from 'axios';

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api'; // Local development
  }
  return `${process.env.REACT_APP_API_URL}/api`; // Production (Render)
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

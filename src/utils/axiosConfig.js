import axios from 'axios';

// Configuration de base d'axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-end-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Instance axios pour les routes publiques (sans token)
const publicAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-end-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Gérer l'expiration du token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { axiosInstance as default, publicAxiosInstance }; 
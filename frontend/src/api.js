import axios from 'axios';

const api = axios.create({
  // Vite proxy handles redirecting this to the backend.
  // In production, this would be your actual backend URL.
  baseURL: '/api' 
});

export default api;
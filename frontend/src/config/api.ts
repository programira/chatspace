import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Use environment variable or fallback
  timeout: 10000, // Optional timeout
});

export default api;

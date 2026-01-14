// API Configuration
// Automatically uses the correct backend URL based on environment
export const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://hanwo-backend.onrender.com' // Your Render backend URL
    : 'http://localhost:4000');

export default { API_URL };

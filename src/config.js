// API Configuration
// In production, frontend and backend are on the same server (same origin)
// In development, backend runs separately on localhost:4000
export const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? '' // Same origin - no need for full URL
    : 'http://localhost:4000');

export default { API_URL };

export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL !== undefined && process.env.NEXT_PUBLIC_API_URL !== ""
    ? process.env.NEXT_PUBLIC_API_URL
    : (typeof window !== 'undefined' ? '' : 'http://127.0.0.1:8000');

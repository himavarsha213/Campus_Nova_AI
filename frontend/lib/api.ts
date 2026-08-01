export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() !== "" && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getApiBaseUrl();

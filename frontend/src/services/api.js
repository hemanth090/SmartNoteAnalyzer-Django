import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies/sessions
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.error || 'Invalid request');
    } else if (error.response?.status === 404) {
      throw new Error('Service not found');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
);

export const analyzeText = async (text) => {
  try {
    const response = await api.post('/analyze-text/', { text });
    return response.data;
  } catch (error) {
    console.error('Text analysis error:', error);
    throw error;
  }
};

export const analyzeFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/analyze-file/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('File analysis error:', error);
    throw error;
  }
};

export const compareNotes = async (note1, note2) => {
  try {
    const response = await api.post('/compare-notes/', { 
      note1, 
      note2 
    });
    return response.data;
  } catch (error) {
    console.error('Note comparison error:', error);
    throw error;
  }
};

export const getAnalysisHistory = async () => {
  try {
    const response = await api.get('/analysis-history/');
    return response.data;
  } catch (error) {
    console.error('History fetch error:', error);
    throw error;
  }
};

export default api;
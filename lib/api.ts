import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          Cookies.set('access_token', access_token, { expires: 1 });
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
      }
    }

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'An error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other error
      throw new Error('An unexpected error occurred');
    }
  }
);

// API endpoints
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    register: (data: { name: string; email: string; password: string }) =>
      apiClient.post('/auth/register', data),
    logout: () => apiClient.post('/auth/logout'),
    refresh: (refreshToken: string) =>
      apiClient.post('/auth/refresh', { refresh_token: refreshToken }),
    profile: () => apiClient.get('/auth/profile'),
    updateProfile: (data: any) => apiClient.put('/auth/profile', data),
  },

  // Menu
  menu: {
    getItems: (params?: any) => apiClient.get('/menu', { params }),
    getItem: (id: string) => apiClient.get(`/menu/${id}`),
    searchItems: (query: string) => apiClient.get(`/menu/search?q=${query}`),
  },

  // Orders
  orders: {
    create: (orderData: any) => apiClient.post('/orders', orderData),
    getAll: () => apiClient.get('/orders'),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    updateStatus: (id: string, status: string) =>
      apiClient.patch(`/orders/${id}/status`, { status }),
    cancel: (id: string) => apiClient.patch(`/orders/${id}/cancel`),
  },

  // Reservations
  reservations: {
    create: (reservationData: any) => apiClient.post('/reservations', reservationData),
    getAll: () => apiClient.get('/reservations'),
    getById: (id: string) => apiClient.get(`/reservations/${id}`),
    update: (id: string, data: any) => apiClient.put(`/reservations/${id}`, data),
    cancel: (id: string) => apiClient.patch(`/reservations/${id}/cancel`),
    getAvailableSlots: (date: string) =>
      apiClient.get(`/reservations/availability?date=${date}`),
  },

  // Payments
  payments: {
    createIntent: (amount: number) =>
      apiClient.post('/payments/create-intent', { amount }),
    confirmPayment: (paymentIntentId: string) =>
      apiClient.post('/payments/confirm', { payment_intent_id: paymentIntentId }),
    getMethods: () => apiClient.get('/payments/methods'),
    addMethod: (methodData: any) => apiClient.post('/payments/methods', methodData),
    removeMethod: (methodId: string) => apiClient.delete(`/payments/methods/${methodId}`),
  },

  // Reviews
  reviews: {
    create: (reviewData: any) => apiClient.post('/reviews', reviewData),
    getByMenuItem: (menuItemId: string) =>
      apiClient.get(`/reviews/menu-item/${menuItemId}`),
    getByUser: () => apiClient.get('/reviews/user'),
  },
};

// Utility functions for API calls
export const withRetry = async (
  apiCall: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
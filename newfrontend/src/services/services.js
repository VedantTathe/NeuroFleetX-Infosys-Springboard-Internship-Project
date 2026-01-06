import apiClient from './apiClient';

// Authentication Services
export const authService = {
  // User login
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // User logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token refresh failed' };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await apiClient.post('/auth/verify-token');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token verification failed' };
    }
  },
};

// Dashboard Services
export const dashboardService = {
  // Admin dashboard metrics
  getAdminMetrics: async () => {
    try {
      const response = await apiClient.get('/dashboard/admin/metrics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch admin metrics' };
    }
  },

  // Fleet manager dashboard metrics
  getFleetManagerMetrics: async () => {
    try {
      const response = await apiClient.get('/dashboard/fleet-manager/metrics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch fleet manager metrics' };
    }
  },

  // Driver dashboard metrics
  getDriverMetrics: async () => {
    try {
      const response = await apiClient.get('/dashboard/driver/metrics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch driver metrics' };
    }
  },

  // Customer dashboard metrics
  getCustomerMetrics: async () => {
    try {
      const response = await apiClient.get('/dashboard/customer/metrics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch customer metrics' };
    }
  },
};

// User Services
export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },
};

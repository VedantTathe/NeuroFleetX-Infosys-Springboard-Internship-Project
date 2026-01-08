// API Client for backend communication
const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('neurofleetx_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API Response: ${url}`, data);
      return data;
      
    } catch (error) {
      console.error(`API Error: ${url}`, error);
      
      // If it's a network error or CORS issue, provide helpful message
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        throw new Error('Unable to connect to backend. Please ensure the backend server is running on http://localhost:5000');
      }
      
      throw error;
    }
  }

  // HTTP methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck() {
    try {
      return await this.get('/health');
    } catch (error) {
      console.error('Backend health check failed:', error);
      return null;
    }
  }

  // Test connection
  async testConnection() {
    try {
      return await this.get('/test');
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return null;
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

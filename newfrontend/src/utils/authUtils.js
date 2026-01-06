// JWT Token Management Utilities

const TOKEN_KEY = 'neurofleetx_token';
const USER_KEY = 'neurofleetx_user';

// User Roles
export const ROLES = {
  ADMIN: 'ADMIN',
  FLEET_MANAGER: 'FLEET_MANAGER',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER'
};

// Store token and user data
export const setToken = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem('neurofleetx_token_time', Date.now().toString());
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get user information
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Clear authentication (logout)
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('neurofleetx_token_time');
};

// Check if user is logged in
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  // Check if token is expired
  return !isTokenExpired(token);
};

// Get current user's role
export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};

// Check if user has specific role
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

// Decode JWT token
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  try {
    // For UUID tokens (our current implementation), we'll use a simple approach
    // Store token creation time and check if it's older than 24 hours
    const tokenCreationTime = localStorage.getItem('neurofleetx_token_time');
    if (!tokenCreationTime) return true;
    
    const currentTime = Date.now();
    const tokenAge = currentTime - parseInt(tokenCreationTime);
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return tokenAge > twentyFourHours;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Get token expiration time
export const getTokenExpiration = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = decodeToken(token);
    return decoded ? decoded.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

// Refresh token if needed (placeholder for actual refresh logic)
export const refreshTokenIfNeeded = async () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    clearAuth();
    return false;
  }
  
  // Check if token expires in next 5 minutes
  const expiration = getTokenExpiration();
  const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
  
  if (expiration && expiration < fiveMinutesFromNow) {
    // TODO: Implement actual token refresh logic
    console.log('Token will expire soon, refresh needed');
    return false;
  }
  
  return true;
};

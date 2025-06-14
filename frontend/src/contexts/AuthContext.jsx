import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize token and user from localStorage
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  // Login function with admin support
  const login = async (emailOrPhone, password, isAdminLogin = false) => {
    try {
      setLoading(true);
      
      if (!emailOrPhone || !password) {
        throw new Error('Email/phone and password are required');
      }
      
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: {
          emailOrPhone: emailOrPhone.toString().trim(),
          password,
          isAdmin: isAdminLogin // Send a flag to the backend to check for admin role
        },
      });
      
      if (!response || !response.token) {
        throw new Error('Invalid response from server. Please try again.');
      }

      // Check if admin login was requested but user is not admin
      if (isAdminLogin && response.user.role !== 'admin') {
        throw new Error('Access denied. Only administrators can access the admin panel.');
      }
      
      // Store token and user in localStorage - use consistent key names
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (form) => {
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: form,
      });
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Clear both possible token keys for consistency
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
  };

  const isAuthenticated = Boolean(user) && Boolean(token);
  const isAdmin = user?.role === 'admin';

  const value = {
    user, 
    token, 
    login, 
    register, 
    logout, 
    isAuthenticated,
    isAdmin,
    loading,
    // Helper method to check if a resource belongs to current user
    isOwnResource: (resourceUserId) => {
      if (!user || !resourceUserId) return false;
      return user._id === resourceUserId || user.id === resourceUserId;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

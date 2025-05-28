import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await apiFetch('/auth/profile', { token });
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        // Clear invalid token
        setUser(null);
        setToken(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [token]);

  const login = async (emailOrPhone, password, isAdminLogin = false) => {
    try {
      // Ensure emailOrPhone is a string and properly trimmed
      const cleanedEmailOrPhone = emailOrPhone.toString().trim();
      
      console.log("Login attempt:", { emailOrPhone: cleanedEmailOrPhone });
      
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: {
          emailOrPhone: cleanedEmailOrPhone,
          password,
          isAdmin: isAdminLogin // Send a flag to the backend to check for admin role
        },
      });
      
      if (!data.token) {
        throw new Error('No token received from server');
      }
      
      if (isAdminLogin && (!data.user || data.user.role !== 'admin')) {
        throw new Error('Access denied. Only administrators can login to the admin panel.');
      }
      
      setToken(data.token);
      setUser(data.user);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (err) {
      console.error('Login failed', err);
      throw err;
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
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

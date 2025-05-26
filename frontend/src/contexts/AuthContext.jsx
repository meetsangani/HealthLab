import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      apiFetch('/auth/profile', { token })
        .then((userData) => {
          setUser(userData);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (emailOrPhone, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { emailOrPhone, password },
      });
      
      if (!data.token) {
        throw new Error('No token received from server');
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
    await apiFetch('/auth/register', {
      method: 'POST',
      body: form,
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      isAuthenticated,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

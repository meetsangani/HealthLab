"use client"

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get token from localStorage on client side only
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Here you would typically validate the token with your API
      // For now, we'll just set loading to false
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (emailOrPhone, password) => {
    try {
      // Clean and normalize the input
      const cleanedEmailOrPhone = emailOrPhone.toString().trim();
      
      console.log("Attempting login with:", { emailOrPhone: cleanedEmailOrPhone });
      
      const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          emailOrPhone: cleanedEmailOrPhone, 
          password 
        })
      });

      // Log response status for debugging
      console.log("Login response status:", response.status);

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Login error response:", data);
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (form) => {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${serverUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Registration failed');
    }

    return response.json();
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, userAPI } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // Fetch user profile
          const userData = await userAPI.getProfile();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (emailOrPhone, password) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!emailOrPhone || !password) {
        throw new Error('Email/phone and password are required');
      }
      
      // Using emailOrPhone parameter directly
      const response = await authAPI.login({ emailOrPhone, password });
      
      if (!response || !response.token) {
        throw new Error('Invalid response from server. Please try again.');
      }
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      return response.user;
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.message || 'Login failed. Please check your credentials or try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function - first step
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for registration
  const verifyOTP = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.verifyOTP({ email, otp });
      return response;
    } catch (err) {
      setError(err.message || 'OTP verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await userAPI.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    verifyOTP,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

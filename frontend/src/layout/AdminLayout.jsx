import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../providers/theme-provider';
import AdminSidebar from '../components/admin-sidebar';

export default function AdminLayout() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If authentication is complete and user is not admin, redirect to admin login
    if (!loading && isAuthenticated && !isAdmin) {
      navigate('/login?role=admin', { 
        replace: true, 
        state: { message: 'Access denied. Only administrators can access this area.' } 
      });
    }
    
    // If not authenticated, redirect to admin login
    if (!loading && !isAuthenticated) {
      navigate('/login?role=admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Only render admin layout if user is admin and authenticated
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="healthlab-theme">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 md:ml-64">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}

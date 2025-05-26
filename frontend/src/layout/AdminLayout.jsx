import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin-sidebar';
import { ThemeProvider } from '../providers/theme-provider';
import { AuthProvider } from '../contexts/AuthContext';

export default function AdminLayout() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="healthlab-theme">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-6 md:p-8 md:ml-64">
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

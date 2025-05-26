import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar'; // import main navbar
import { ThemeProvider } from '../providers/theme-provider';
import { AuthProvider } from '../contexts/AuthContext';

export default function DashboardLayout() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="healthlab-theme">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

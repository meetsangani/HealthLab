import React from 'react';
import { Outlet } from 'react-router-dom';
// import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { ThemeProvider } from '../providers/theme-provider';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="healthlab-theme">
        <div className="flex min-h-screen flex-col">
          {/* <Navbar /> */}
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

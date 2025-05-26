import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import RootLayout from './layout/RootLayout';
import DashboardLayout from './layout/DashboardLayout';
import AdminLayout from './layout/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TestCatalogPage from './pages/TestCatalogPage';
import TestDetailsPage from './pages/TestDetailsPage';
import BookingPage from './pages/BookingPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import BookingsPage from './pages/dashboard/BookingsPage';
import ReportsPage from './pages/dashboard/ReportsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManageCustomersPage from './pages/admin/ManageCustomersPage';
import ManageReportsPage from './pages/admin/ManageReportsPage';
import ManageTestsPage from './pages/admin/ManageTestsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="tests" element={<TestCatalogPage />} />
        <Route path="tests/:id" element={<TestDetailsPage />} />
        <Route path="booking" element={<BookingPage />} />
        
        {/* Auth Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="bookings" element={<ManageBookingsPage />} />
        <Route path="customers" element={<ManageCustomersPage />} />
        <Route path="reports" element={<ManageReportsPage />} />
        <Route path="tests" element={<ManageTestsPage />} />
      </Route>
    </Routes>
  );
}

export default App;

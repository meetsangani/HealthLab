import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import RootLayout from './layout/RootLayout';
import DashboardLayout from './layout/DashboardLayout';

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
import AdminLoginPage from './pages/auth/LoginPage'; // <-- Use the correct path for admin login

// Customer Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import BookingsPage from './pages/dashboard/BookingsPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import BookingDetails from './pages/customer/BookingDetails';
import BookingDetailPage from './pages/dashboard/BookingDetailPage';

// Admin Pages
import ManageTests from './pages/admin/ManageTests';

function App() {
  return (
    <Router>
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
          <Route path="bookings/:id" element={<BookingDetails />} />
          <Route path="bookings/:bookingId" element={<BookingDetailPage />} />
        </Route>

        {/* Customer Booking Details Route */}
        <Route path="/customer/bookings/:bookingId" element={<BookingDetails />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/tests" element={<ManageTests />} />
      </Routes>
    </Router>
  );
}

export default App;

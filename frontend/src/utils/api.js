const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Base API function
export const apiFetch = async (endpoint, options = {}) => {
  const { token, ...fetchOptions } = options;
  
  const config = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Reports API
export const reportsAPI = {
  getReportByBookingId: async (bookingId, token) => {
    try {
      const response = await apiFetch(`/reports/booking/${bookingId}`, { token });
      return response;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },
  
  downloadReport: async (reportId, token) => {
    try {
      const response = await apiFetch(`/reports/download/${reportId}`, { token });
      return response;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }
};

// Tests API
export const testsAPI = {
  getAllTests: (token) => apiFetch('/tests', { token }),
  getTestById: (id, token) => apiFetch(`/tests/${id}`, { token }),
  getAdminTests: (token) => apiFetch('/admin/tests', { token }),
  createAdminTest: (testData, token) => apiFetch('/admin/tests', {
    method: 'POST',
    body: JSON.stringify(testData),
    token
  }),
  updateAdminTest: (id, testData, token) => apiFetch(`/admin/tests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(testData),
    token
  }),
  deleteAdminTest: (id, token) => apiFetch(`/admin/tests/${id}`, {
    method: 'DELETE',
    token
  })
};

// Bookings API
export const bookingsAPI = {
  createBooking: (bookingData, token) => apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
    token
  }),
  getUserBookings: (token) => apiFetch('/bookings/user', { token }),
  getBookingById: (id, token) => apiFetch(`/bookings/${id}`, { token })
};

// Admin API
export const adminAPI = {
  getStats: (token) => apiFetch('/admin/stats', { token }),
  getBookings: (token, filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return apiFetch(`/admin/bookings${queryString ? '?' + queryString : ''}`, { token });
  },
  updateBookingStatus: (id, status, token) => apiFetch(`/admin/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    token
  }),
  getCustomers: (token) => apiFetch('/admin/customers', { token })
};

// Export all API functions
export default {
  tests: testsAPI,
  bookings: bookingsAPI,
  reports: reportsAPI,
};

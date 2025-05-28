const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  // Add auth token if provided
  if (options.token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${options.token}`
    };
    // Remove token from options to avoid sending it as a separate parameter
    const { token, ...restOptions } = options;
    options = restOptions;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

// Add testsAPI to match the structure used in TestCatalogPage
export const testsAPI = {
  getAllTests: () => apiFetch('/tests'),
  getTestById: (id) => apiFetch(`/tests/${id}`),
};

// Add bookingsAPI for handling test bookings
export const bookingsAPI = {
  createBooking: (bookingData, token) => apiFetch('/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
    token
  }),
  getUserBookings: (token) => apiFetch('/bookings', {
    token
  }),
  getAllBookings: (token) => apiFetch('/bookings', {
    token
  }),
  getBookingById: (id, token) => apiFetch(`/bookings/${id}`, {
    token
  }),
  cancelBooking: (id, token) => apiFetch(`/bookings/${id}/cancel`, {
    method: 'PUT',
    token
  }),
  updateBookingStatus: (id, status, token) => apiFetch(`/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    token
  })
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
      // This would typically return a download URL or blob
      const response = await apiFetch(`/reports/download/${reportId}`, { token });
      return response.downloadUrl || response;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }
};

// Export all API functions
export default {
  tests: testsAPI,
  bookings: bookingsAPI,
  reports: reportsAPI,
};

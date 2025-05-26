const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if provided
  if (options.token) {
    config.headers.Authorization = `Bearer ${options.token}`;
  }

  // Add body if provided
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to the server. Please check if the backend service is running.');
    }
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
  createBooking: (bookingData) => apiFetch('/bookings', {
    method: 'POST',
    body: bookingData
  }),
  getUserBookings: (token) => apiFetch('/bookings', {
    token
  }),
  getBookingById: (id, token) => apiFetch(`/bookings/${id}`, {
    token
  }),
  cancelBooking: (id, token) => apiFetch(`/bookings/${id}/cancel`, {
    method: 'PUT',
    token
  })
};

// Export all API functions
export default {
  tests: testsAPI,
  bookings: bookingsAPI,
};

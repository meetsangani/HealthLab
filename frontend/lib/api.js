/**
 * API client for making requests to the backend
 */

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// Normalize base URL: remove trailing '/api' or '/' if they exist, then append '/api'.
// This ensures that if NEXT_PUBLIC_API_URL is 'http://host.com', 'http://host.com/', 
// 'http://host.com/api', or 'http://host.com/api/', the final API_URL is 'http://host.com/api'.
const normalizedBaseUrl = rawApiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_URL = `${normalizedBaseUrl}/api`;

/**
 * Base fetch function with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  console.log('Making request to:', url, {
    method: options.method || 'GET',
    bodyLength: options.body ? JSON.stringify(options.body).length : 0
  });
  
  // Add default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available - extract from options
  const token = options.token;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Create a new options object without the token property
  const { token: _, ...cleanOptions } = options;

  // Format request body if it's an object
  let requestBody = cleanOptions.body;
  if (requestBody && typeof requestBody === 'object') {
    requestBody = JSON.stringify(requestBody);
  }

  const config = {
    ...cleanOptions,
    headers,
    body: requestBody
  };

  try {
    console.log('Request config:', {
      url,
      method: config.method || 'GET',
      headers: { ...config.headers, Authorization: config.headers.Authorization ? 'Bearer [REDACTED]' : undefined },
    });

    const response = await fetch(url, config);
    
    // Check content type to determine how to parse the response
    const contentType = response.headers.get('content-type');
    
    // Handle HTTP errors
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        
        // Better error logging with more context
        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          errorData
        });
        
        // Handle empty error response objects
        const errorMessage = errorData?.message || errorData?.error || errorData?.details;
        
        // Add specific handling for 404 errors
        if (response.status === 404) {
          const notFoundMessage = errorMessage || 'Resource not found';
          throw new Error(`Not found: ${notFoundMessage}`);
        }
        
        // Handle 401/403 errors
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to access this resource.');
        }
        
        // Handle other errors with better fallback messages
        const finalErrorMessage = errorMessage || `Server returned ${response.status} error`;
        throw new Error(finalErrorMessage);
      } else {
        const textError = await response.text();
        console.error(`Non-JSON error response (${response.status}):`, {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          textError
        });
        
        // Handle 404 specifically
        if (response.status === 404) {
          throw new Error('Resource not found: The requested item does not exist');
        }
        
        // Handle 401/403 for non-JSON responses
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to access this resource.');
        }
        
        const errorMessage = textError || 'The API endpoint might not be available';
        throw new Error(`Server error (${response.status}): ${errorMessage}`);
      }
    }
    
    // Parse response based on content type
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const textResponse = await response.text();
      console.warn('Received non-JSON response:', textResponse);
      return { message: textResponse };
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  verifyOTP: (data) => fetchAPI('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Modify login endpoint to correctly format the request
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: {
      emailOrPhone: credentials.emailOrPhone.toString().trim(),
      password: credentials.password
    },
  }),
  
  forgotPassword: (email) => fetchAPI('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  
  resetPassword: (data) => fetchAPI('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// User API
export const userAPI = {
  getProfile: () => fetchAPI('/users/profile'),
  
  updateProfile: (userData) => fetchAPI('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

export const testsAPI = {
  getAllTests: () => fetchAPI('/tests'),

  getTestById: (id) => fetchAPI(`/tests/${id}`)
}

export const bookingsAPI = {
  createBooking: (bookingData, token) => {
    if (!token) {
      throw new Error('Authentication token is required for creating bookings');
    }
    return fetchAPI('/bookings', {
      method: 'POST',
      body: bookingData,
      token
    });
  },

  getUserBookings: (token) => {
    if (!token) {
      throw new Error('Authentication token is required for fetching user bookings');
    }
    return fetchAPI('/bookings/user', {
      token
    });
  }
}

// Reports API
export const reportsAPI = {
  getUserReports: () => fetchAPI('/reports/user'),
  
  getReportById: (id) => fetchAPI(`/reports/${id}`),
};

export default {
  auth: authAPI,
  user: userAPI,
  tests: testsAPI,
  bookings: bookingsAPI,
  reports: reportsAPI,
};

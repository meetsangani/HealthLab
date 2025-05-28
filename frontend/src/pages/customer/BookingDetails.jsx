import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const BookingDetails = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        // Try to get from localStorage first
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const foundBooking = localBookings.find(b => (b._id === id || b.id === id));
        
        if (foundBooking) {
          setBooking(foundBooking);
          setLoading(false);
          return;
        }
        
        // If not found in localStorage, fetch from API
        const data = await apiFetch(`/bookings/${id}`, { token });
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchBookingDetails();
    }
  }, [id, token]);

  const handleGoBack = () => {
    navigate('/customer/bookings');
  };

  const handleDownloadReport = () => {
    // In a real app, this would download the actual report
    // For demonstration, we'll just show an alert
    alert('Report downloading...');
    
    // If there's a report URL, you would redirect to it or open it in a new tab
    // if (booking.reportUrl) {
    //   window.open(booking.reportUrl, '_blank');
    // }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={handleGoBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="mb-4">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Go Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleGoBack}
            className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-blue-900">
                {booking.testName || booking.test?.name || 'Unknown Test'}
              </h2>
              <p className="text-gray-600">
                Booking ID: <span className="font-mono font-medium">{booking._id || booking.id}</span>
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {formatStatus(booking.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Test Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Test Name:</span>
                  <span className="font-medium">{booking.testName || booking.test?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Test Category:</span>
                  <span className="font-medium">{booking.test?.category || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₹{booking.price || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Turnaround Time:</span>
                  <span className="font-medium">{booking.test?.turnaround || 'Not specified'}</span>
                </div>
                {booking.test?.description && (
                  <div>
                    <span className="text-gray-600 block mb-1">Description:</span>
                    <p className="text-sm">{booking.test.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Appointment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{booking.date ? formatDate(booking.date) : 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Slot:</span>
                  <span className="font-medium">{booking.timeSlot || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection Type:</span>
                  <span className="font-medium">
                    {booking.collectionType === 'home' ? 'Home Collection' : 'Visit Center'}
                  </span>
                </div>
                {booking.collectionType === 'home' && booking.address && (
                  <div>
                    <span className="text-gray-600 block mb-1">Collection Address:</span>
                    <p className="text-sm">{booking.address}</p>
                  </div>
                )}
                {booking.notes && (
                  <div>
                    <span className="text-gray-600 block mb-1">Additional Notes:</span>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{booking.userName || user?.name || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{booking.userEmail || user?.email || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{booking.userPhone || user?.phone || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Date:</span>
                <span className="font-medium">{booking.createdAt ? formatDate(booking.createdAt) : 'Not specified'}</span>
              </div>
            </div>
          </div>

          {(booking.status === 'completed' || booking.status === 'report_ready') && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Test Report</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your test report is ready. You can view or download it below.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleDownloadReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Report
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  View Report
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-between">
            <button 
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Back to Bookings
            </button>
            
            {booking.status === 'pending' && (
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStatusColor = (status) => {
  const colorMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    sample_collected: 'bg-indigo-100 text-indigo-800',
    report_ready: 'bg-purple-100 text-purple-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

const formatStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    sample_collected: 'Sample Collected',
    report_ready: 'Report Ready'
  };
  return statusMap[status] || status;
};

export default BookingDetails;

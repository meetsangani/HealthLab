import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingsAPI, apiFetch } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

// Move isUserBooking outside to avoid closure issues
const isUserBooking = (booking, user) => {
  if (!user) return false;
  return (
    booking.user === user._id ||
    booking.user === user.id ||
    booking.userEmail === user.email ||
    booking.userName === user.name ||
    (booking.customer && (
      booking.customer._id === user._id ||
      booking.customer.id === user._id ||
      booking.customer.email === user.email
    ))
  );
};

const Bookings = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Always filter by user
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        if (localBookings.length > 0) {
          const userBookings = localBookings.filter(b => isUserBooking(b, user));
          setBookings(userBookings);
          setLoading(false);
          return;
        }

        const data = await apiFetch(`/bookings?userId=${user._id}`, { token });
        const userBookings = data.filter(b => isUserBooking(b, user));
        setBookings(userBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, token, isAuthenticated]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = searchTerm === '' || 
        booking.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.test?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking._id || booking.id)?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const handleViewBookingDetails = (bookingId) => {
    // Fix the navigation path to ensure it works
    navigate(`/customer/bookings/${bookingId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p>You need to be logged in to view your bookings.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Bookings...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by test name or booking ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 min-w-64 px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="sample_collected">Sample Collected</option>
              <option value="processing">Processing</option>
              <option value="report_ready">Report Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No bookings found.</p>
            <button
              onClick={() => navigate('/tests')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book a Test
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id || booking.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      {booking.testName || booking.test?.name || 'Unknown Test'}
                    </h3>
                    <p className="text-gray-600">
                      Booking ID: {(booking._id || booking.id)?.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {formatStatus(booking.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Time: {booking.timeSlot || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Collection: {booking.collectionType === 'home' ? 'Home Collection' : 'Visit Center'}</p>
                    <p className="text-sm text-gray-600">Price: ₹{booking.price}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewBookingDetails(booking._id || booking.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </button>
                  {booking.status === 'completed' && booking.report && (
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Download Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    sample_collected: 'bg-purple-100 text-purple-800',
    processing: 'bg-indigo-100 text-indigo-800',
    report_ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const formatStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    sample_collected: 'Sample Collected',
    processing: 'Processing',
    report_ready: 'Report Ready',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  return statusMap[status] || status;
};

export default Bookings;

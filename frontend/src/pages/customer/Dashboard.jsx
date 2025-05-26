import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentBookingId, setRecentBookingId] = useState(null);

  useEffect(() => {
    // Check if we're coming from the booking page with a booking reference
    const params = new URLSearchParams(location.search);
    const bookingRef = params.get('bookingRef');
    if (bookingRef) {
      setRecentBookingId(bookingRef);
      // Clear the URL parameter after reading it
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (token) {
      setLoading(true);
      
      // Try to get bookings from localStorage first (for demo purposes)
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      if (localBookings.length > 0) {
        setBookings(localBookings);
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from API
      apiFetch('/bookings', { token })
        .then(data => {
          setBookings(data);
          setLoading(false);
        })
        .catch(() => {
          setBookings([]);
          setLoading(false);
        });
    }
  }, [token]);

  // Stats
  const total = bookings.length;
  const upcoming = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed' || b.status === 'sample_collected').length;
  const completed = bookings.filter(b => b.status === 'completed').length;

  const handleBookTestClick = () => {
    if (isAuthenticated) {
      navigate('/tests'); // Or your desired route for booking/test catalog
    } else {
      navigate('/login?redirect=/tests'); // Redirect to login, then to tests
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-10">
      {/* Hero Section */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-12 shadow-sm">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Welcome to Your Dashboard</h2>
          <p className="text-gray-700 mb-4">Manage your health tests, view reports, and keep track of your bookings in one place.</p>
          <button 
            onClick={handleBookTestClick}
            className="btn btn-primary px-5 py-2 rounded-full text-base font-semibold shadow hover:shadow-md transition"
          >
            Book a Test
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/dashboard-illustration.svg" alt="Dashboard" className="w-48 md:w-64" loading="lazy" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={total} color="bg-blue-100 text-blue-800" />
        <StatCard label="Upcoming" value={upcoming} color="bg-yellow-100 text-yellow-800" />
        <StatCard label="Completed" value={completed} color="bg-green-100 text-green-800" />
      </div>

      {/* Bookings List */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Bookings</h3>
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
        </div>
      ) : (
        <>
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map(booking => (
                <div 
                  key={booking._id || booking.id} 
                  className={`bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden border ${
                    (booking._id === recentBookingId || booking.id === recentBookingId) 
                      ? 'border-blue-500 ring-2 ring-blue-300' 
                      : 'border-gray-100'
                  } flex flex-col`}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg text-blue-900">{booking.test?.name || booking.testName || 'Unknown Test'}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Date:</span>
                      <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    {booking.timeSlot && (
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Time:</span>
                        <span className="font-medium">{booking.timeSlot}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Collection:</span>
                      <span className="font-medium">{booking.collectionType === 'home' ? 'Home Collection' : 'Visit Center'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>Booking ID:</span>
                      <span className="font-mono">{(booking._id || booking.id)?.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="flex space-x-2 mt-auto">
                      <button className="btn btn-primary w-full px-3 py-1 text-sm rounded-full">View Details</button>
                      {booking.status === 'completed' && (
                        <button className="btn btn-secondary w-full px-3 py-1 text-sm rounded-full">Download Report</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <img src="/empty-bookings.svg" alt="No bookings" className="w-40 mb-6" loading="lazy" />
              <p className="text-gray-600 mb-4 text-lg">You don't have any bookings yet.</p>
              <button 
                onClick={handleBookTestClick}
                className="btn btn-primary px-4 py-2 text-base rounded-full"
              >
                Book a Test
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Stat Card Component
function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl p-6 flex flex-col items-center shadow-sm ${color}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
}

// Helper functions
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

export default Dashboard;

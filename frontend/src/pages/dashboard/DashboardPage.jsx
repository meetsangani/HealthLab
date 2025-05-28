import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsAPI.getAllBookings(token);
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
        
        <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left">Test</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {bookings.map((booking) => (
              <tr key={booking._id || booking.id}>
                <td className="px-4 py-3">{booking.testName}</td>
                <td className="px-4 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{booking.status}</td>
                <td className="px-4 py-3">
                  <Link 
                    to={`/dashboard/bookings/${booking._id || booking.id}`}
                    className="text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, FileText, Settings, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, type Booking } from '../lib/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, tests(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      // Set mock data for demonstration
      setMockBookings();
    } finally {
      setLoading(false);
    }
  };

  const setMockBookings = () => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        user_id: user?.id || '',
        test_ids: ['1', '2'],
        total_amount: 750,
        booking_date: '2024-01-15',
        booking_time: '09:00',
        status: 'report_ready',
        customer_name: user?.full_name || '',
        customer_phone: user?.phone || '',
        customer_email: user?.email || '',
        customer_address: user?.address || '',
        report_url: 'https://example.com/report1.pdf',
        created_at: '2024-01-10T10:00:00Z',
      },
      {
        id: '2',
        user_id: user?.id || '',
        test_ids: ['3'],
        total_amount: 600,
        booking_date: '2024-01-20',
        booking_time: '11:00',
        status: 'sample_collected',
        customer_name: user?.full_name || '',
        customer_phone: user?.phone || '',
        customer_email: user?.email || '',
        customer_address: user?.address || '',
        created_at: '2024-01-18T14:30:00Z',
      },
      {
        id: '3',
        user_id: user?.id || '',
        test_ids: ['4', '5'],
        total_amount: 550,
        booking_date: '2024-01-25',
        booking_time: '08:30',
        status: 'pending',
        customer_name: user?.full_name || '',
        customer_phone: user?.phone || '',
        customer_email: user?.email || '',
        customer_address: user?.address || '',
        created_at: '2024-01-22T09:15:00Z',
      },
    ];
    setBookings(mockBookings);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'sample_collected':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'report_ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'sample_collected':
        return 'Sample Collected';
      case 'report_ready':
        return 'Report Ready';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sample_collected':
        return 'bg-blue-100 text-blue-800';
      case 'report_ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'report_ready').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name}!</h1>
          <p className="text-gray-600 mt-2">Manage your tests, view reports, and track your health journey.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Tests</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Tests</p>
                <p className="text-2xl font-semibold text-gray-900">{completedBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(booking.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            Booking #{booking.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')} at {booking.booking_time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">₹{booking.total_amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    to="/tests"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book New Test
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">All Bookings</h2>
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(booking.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            Booking #{booking.id.slice(0, 8)}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">₹{booking.total_amount}</p>
                          <p className="text-sm text-gray-500">
                            Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Appointment Date & Time</p>
                          <p className="text-gray-900">
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')} at {booking.booking_time}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tests</p>
                          <p className="text-gray-900">{booking.test_ids.length} test(s) booked</p>
                        </div>
                      </div>

                      {booking.status === 'report_ready' && booking.report_url && (
                        <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            <span className="text-green-800 font-medium">Report Ready</span>
                          </div>
                          <a
                            href={booking.report_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download Report</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {user?.date_of_birth ? format(new Date(user.date_of_birth), 'MMM dd, yyyy') : 'Not provided'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user?.address}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
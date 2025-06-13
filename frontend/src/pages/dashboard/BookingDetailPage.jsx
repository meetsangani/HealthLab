import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Download, ArrowLeft, Calendar, Clock, MapPin, CheckCircle, AlertCircle, User, Phone, Mail } from 'lucide-react';
import { bookingsAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const data = await bookingsAPI.getBookingById(bookingId, token);
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId && token) {
      fetchBookingDetails();
    }
  }, [bookingId, token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'sample_collected':
        return 'bg-indigo-100 text-indigo-800';
      case 'report_ready':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generatePDFReport = () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text('HealthLab - Test Report', 20, 30);
      
      // Add booking details
      doc.setFontSize(12);
      doc.text(`Booking ID: ${booking._id || booking.id}`, 20, 50);
      doc.text(`Test: ${booking.testName || booking.test?.name}`, 20, 60);
      doc.text(`Patient: ${booking.userName || user?.name}`, 20, 70);
      doc.text(`Date: ${formatDate(booking.date)}`, 20, 80);
      doc.text(`Status: ${booking.status}`, 20, 90);
      
      // Save the PDF
      doc.save(`report-${booking._id || booking.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading booking details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!booking) return <div className="container mx-auto p-4">Booking not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">{booking.testName || booking.test?.name}</h1>
              <p className="text-gray-600">Booking ID: {booking._id || booking.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Test Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₹{booking.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection:</span>
                  <span className="font-medium">
                    {booking.collectionType === 'home' ? 'Home Collection' : 'Visit Center'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Appointment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(booking.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{booking.timeSlot}</span>
                </div>
              </div>
            </div>
          </div>

          {booking.status === 'completed' && (
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={generatePDFReport}
                disabled={generating}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <Download className="mr-2 h-4 w-4" />
                {generating ? 'Generating...' : 'Download Report'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;

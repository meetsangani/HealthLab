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

  const downloadPDF = () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Add logo and header
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 128);
      doc.text('HealthLab', 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Booking Confirmation', 105, 30, { align: 'center' });
      
      // Add booking info
      doc.setFontSize(12);
      doc.text(`Booking ID: ${booking.id || booking._id || '313FAF'}`, 20, 45);
      doc.text(`Status: ${booking.status || 'Confirmed'}`, 20, 55);
      doc.text(`Test: ${booking.testName || 'Complete Blood Count (CBC)'}`, 20, 65);
      
      // Add patient details section
      doc.setFontSize(14);
      doc.text('Patient Details', 20, 80);
      
      const patientData = [
        ['Name', booking.userName || booking.customer?.name || user?.name || 'Patient Name'],
        ['Contact', booking.userPhone || booking.customer?.phone || user?.phone || 'Not provided'],
        ['Email', booking.userEmail || booking.customer?.email || user?.email || 'Not provided']
      ];
      
      doc.autoTable({
        startY: 85,
        head: [['Detail', 'Value']],
        body: patientData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] }
      });
      
      // Create a table for appointment details
      const finalY1 = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text('Appointment Details', 20, finalY1);
      
      const tableData = [
        ['Appointment Date', formatDate(booking.date) || 'May 28th, 2025'],
        ['Time Slot', booking.timeSlot || '10:00 AM - 11:00 AM'],
        ['Collection Type', booking.collectionType === 'center' ? 'Visit Center' : 'Home Collection'],
        ['Price', `₹${booking.price || '500'}`],
        ['Turnaround Time', booking.turnaround || '24 hours']
      ];
      
      doc.autoTable({
        startY: finalY1 + 5,
        head: [['Detail', 'Value']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] }
      });
      
      // Add instructions if available
      const finalY2 = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text('Pre-Test Instructions', 20, finalY2);
      
      const instructions = [
        'No fasting is typically required for this test.',
        'Bring your ID and booking confirmation.',
        'Arrive 10 minutes before your appointment time.',
        'Wear comfortable clothing with sleeves that can be easily rolled up.',
        'Inform the technician about any medications you are currently taking.'
      ];
      
      doc.setFontSize(10);
      instructions.forEach((instruction, index) => {
        doc.text(`• ${instruction}`, 25, finalY2 + 10 + (index * 7));
      });
      
      // Add footer with contact info
      const finalY3 = finalY2 + 10 + (instructions.length * 7) + 15;
      doc.setFontSize(10);
      doc.text('For any queries, please contact us:', 20, finalY3);
      doc.text('Phone: +91 98765 43210 | Email: info@healthlab.com', 20, finalY3 + 7);
      doc.text('Thank you for choosing HealthLab for your healthcare needs.', 20, finalY3 + 14);
      
      // Save the PDF
      doc.save(`HealthLab-Booking-${booking.id || booking._id || '313FAF'}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span>{error}</span>
        </div>
      </div>
      <div className="mt-4">
        <Link to="/dashboard" className="text-primary hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  // Use mock data if booking is not available (for demo purposes)
  const bookingData = booking || {
    id: '313FAF',
    status: 'Confirmed',
    testName: 'Complete Blood Count (CBC)',
    userName: 'Meet Sangani',
    userPhone: '+91 98765 43210',
    userEmail: 'meet@example.com',
    date: '2025-05-28',
    timeSlot: '10:00 AM - 11:00 AM',
    collectionType: 'center',
    price: 500,
    turnaround: '24 hours'
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 flex items-center mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold">{bookingData.testName}</h1>
              <div className="flex items-center mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(bookingData.status)}`}>
                  {bookingData.status}
                </span>
                <span className="ml-4 text-sm">Booking ID: {bookingData.id}</span>
              </div>
            </div>
            <button 
              onClick={downloadPDF}
              disabled={generating}
              className="mt-4 md:mt-0 bg-white text-primary hover:bg-gray-100 font-medium py-2 px-4 rounded-md transition-colors flex items-center btn-enhanced btn-shine"
            >
              {generating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Patient Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <div className="text-gray-600 text-sm">Name</div>
                  <div className="font-medium">{bookingData.userName || bookingData.customer?.name || user?.name}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <div className="text-gray-600 text-sm">Phone</div>
                  <div className="font-medium">{bookingData.userPhone || bookingData.customer?.phone || 'Not provided'}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <div className="text-gray-600 text-sm">Email</div>
                  <div className="font-medium">{bookingData.userEmail || bookingData.customer?.email || user?.email || 'Not provided'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Test Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Test Details</h2>
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Test</span>
                  <span className="font-medium">{bookingData.testName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium">₹{bookingData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Turnaround</span>
                  <span className="font-medium">{bookingData.turnaround}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection Type</span>
                  <span className="font-medium">
                    {bookingData.collectionType === 'center' ? 'Visit Center' : 'Home Collection'}
                  </span>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="text-gray-600 text-sm">Appointment Date</div>
                    <div className="font-medium">{formatDate(bookingData.date)}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="text-gray-600 text-sm">Time Slot</div>
                    <div className="font-medium">{bookingData.timeSlot}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <div className="text-gray-600 text-sm">Location</div>
                    <div className="font-medium">
                      {bookingData.collectionType === 'center' 
                        ? 'HealthLab Diagnostic Center, 123 Health Street, Medical District, Mumbai' 
                        : bookingData.address || 'Your Home Address'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Pre-Test Instructions</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-blue-800">Preparation for {bookingData.testName}</h3>
                  <div className="mt-2 text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>No fasting is typically required for this test.</li>
                      <li>Bring your ID and booking confirmation.</li>
                      <li>Arrive 10 minutes before your appointment time.</li>
                      <li>Wear comfortable clothing with sleeves that can be easily rolled up.</li>
                      <li>Inform the technician about any medications you are currently taking.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Status */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Report Status</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <div className="flex items-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                    1
                  </div>
                  <div className="absolute top-0 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="font-medium">Booking Confirmed</p>
                  <p className="text-sm text-gray-500">Your booking has been confirmed</p>
                </div>
              </div>
              
              <div className="w-0.5 h-6 bg-gray-300 ml-4 my-2"></div>
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-700 rounded-full">
                  2
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-500">Sample Collection</p>
                  <p className="text-sm text-gray-500">Waiting for your appointment date</p>
                </div>
              </div>
              
              <div className="w-0.5 h-6 bg-gray-300 ml-4 my-2"></div>
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-700 rounded-full">
                  3
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-500">Processing</p>
                  <p className="text-sm text-gray-500">Your sample will be processed in our lab</p>
                </div>
              </div>
              
              <div className="w-0.5 h-6 bg-gray-300 ml-4 my-2"></div>
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-700 rounded-full">
                  4
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-500">Report Ready</p>
                  <p className="text-sm text-gray-500">Your report will be available for download</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 bg-gray-50 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">Need help with your booking?</h3>
                <p className="text-gray-600">Our customer support team is available 24/7</p>
              </div>
              <Link to="/contact" className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;

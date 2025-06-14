"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsAPI } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ArrowLeft, Calendar, FileText, Home, MapPin } from "lucide-react";
import BookingButton from "@/app/components/BookingButton";

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

export default function Dashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth(); // add token here
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const recentBookingRef = searchParams.get('bookingRef');

  // Fetch user bookings and reports
  useEffect(() => {
    async function fetchUserData() {
      if (!isAuthenticated || !user || !token) {
        console.log('Missing authentication data:', { isAuthenticated, hasUser: !!user, hasToken: !!token });
        return;
      }

      try {
        setLoadingBookings(true);
        setError(null); // Reset error state

        try {
          console.log('Fetching bookings for user:', user.email || user.name);
          const bookingsData = await bookingsAPI.getUserBookings(token);
          
          if (bookingsData && Array.isArray(bookingsData) && bookingsData.length > 0) {
            // Filter by user just to be sure
            const userBookings = bookingsData.filter(b => isUserBooking(b, user));
            console.log('Found user bookings:', userBookings.length);
            setBookings(userBookings);
          } else {
            console.log('No bookings found for user');
            setBookings([]);
          }
        } catch (apiError) {
          console.error("Error fetching bookings from API:", apiError);
          
          // Handle specific error types
          if (apiError.message.includes('Authentication required')) {
            setError("Please log in again to view your bookings");
          } else if (apiError.message.includes('Access denied')) {
            setError("You don't have permission to view these bookings");
          } else if (apiError.message.includes('Not found')) {
            // This is expected if user has no bookings yet
            console.log('No bookings endpoint found or no bookings for user');
            setBookings([]);
          } else {
            setError(`Failed to load bookings: ${apiError.message}`);
          }
          
          // Set empty bookings on error (except for auth errors)
          if (!apiError.message.includes('Authentication') && !apiError.message.includes('Access denied')) {
            setBookings([]);
          }
        }
      } catch (err) {
        console.error("Unexpected error fetching bookings:", err);
        setError("An unexpected error occurred while loading your bookings");
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    }

    fetchUserData();
  }, [isAuthenticated, user, token]);

  const handleViewBookingDetails = (bookingId) => {
    router.push(`/bookings/${bookingId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">Please sign in to view your dashboard</p>
            <Button asChild>
              <Link href="/auth/login?redirect=/dashboard">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadingBookings) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Loading your bookings...</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-md p-6 space-y-3">
                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <BookingButton variant="outline">
            Book New Test
          </BookingButton>
        </div>

        {error && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <p className="font-medium">Error loading bookings</p>
                <p className="text-sm mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {bookings.length === 0 && !error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-3">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-4">You haven't booked any tests yet.</p>
              <BookingButton>
                Book Your First Test
              </BookingButton>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card 
                key={booking.id || booking._id} 
                className={`overflow-hidden ${
                  (booking.id === recentBookingRef || booking._id === recentBookingRef) 
                    ? 'border-primary border-2 shadow-md' 
                    : ''
                }`}
              >
                <div className="border-l-4 border-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{booking.testName || booking.test?.name}</CardTitle>
                      <span className={`px-3 py-1 ${getStatusColorClass(booking.status)} text-xs font-medium rounded-full`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>
                    <CardDescription>
                      Booking ID: <span className="font-medium">{booking.id || (booking._id?.slice(-6).toUpperCase())}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Appointment Date</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.date ? format(new Date(booking.date), "PPP") : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileText className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Test Details</p>
                            <p className="text-sm text-muted-foreground">
                              Price: ₹{booking.price} • Turnaround: {booking.turnaround}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Home className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Collection Type</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.collectionType === "center" ? "Visit Center" : "Home Collection"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Time Slot</p>
                            <p className="text-sm text-muted-foreground">{booking.timeSlot || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between">
                      <div>
                        <p className="text-sm font-medium">{booking.customer?.name || user?.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.customer?.mobile || booking.customer?.email}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewBookingDetails(booking.id || booking._id)}
                      >
                        View Details
                      </Button>
                    </div>
                    
                    {(booking.id === recentBookingRef || booking._id === recentBookingRef) && (
                      <div className="mt-4 pt-4 border-t text-center">
                        <p className="text-sm font-medium text-primary">
                          This is your recently booked test
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
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

const getStatusColorClass = (status) => {
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

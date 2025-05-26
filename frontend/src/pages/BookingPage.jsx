import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { testsAPI, bookingsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const testId = searchParams.get('testId');
  const { user, token, isAuthenticated } = useAuth();
  
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    collectionType: 'center',
    address: '',
    notes: ''
  });

  // Fetch test details
  useEffect(() => {
    if (!testId) {
      setError("No test selected. Please select a test first.");
      setLoading(false);
      return;
    }

    const fetchTestDetails = async () => {
      try {
        const data = await testsAPI.getTestById(testId);
        setTest(data);
      } catch (err) {
        console.error("Error fetching test details:", err);
        setError("Failed to load test details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate(`/login?redirect=/booking?testId=${testId}`);
    }
  }, [isAuthenticated, loading, navigate, testId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!test || !user) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Create booking data object
      const bookingData = {
        test: testId,
        date: new Date(formData.date).toISOString(),
        timeSlot: formData.timeSlot,
        collectionType: formData.collectionType,
        address: formData.address,
        notes: formData.notes
      };
      
      // Submit booking to the backend
      const result = await bookingsAPI.createBooking(bookingData);
      
      // Handle successful booking
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            bookingSuccess: true,
            bookingId: result._id 
          } 
        });
      }, 2000);
      
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error && !test) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!test) return <div className="container mx-auto p-4">Test not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Book Test: {test.name}</h1>
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Booking successful! Redirecting to dashboard...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Appointment Date:</label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Preferred Time:</label>
              <select 
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a time slot</option>
                <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
                <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
                <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Collection Type:</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="collectionType" 
                    value="center"
                    checked={formData.collectionType === 'center'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Visit Center
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="collectionType" 
                    value="home"
                    checked={formData.collectionType === 'home'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Home Collection
                </label>
              </div>
            </div>
            
            {formData.collectionType === 'home' && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Address for Home Collection:</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                  required
                ></textarea>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Additional Notes (Optional):</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="2"
              ></textarea>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <p className="flex justify-between mb-1">
                <span>Test:</span>
                <span>{test.name}</span>
              </p>
              <p className="flex justify-between mb-1">
                <span>Price:</span>
                <span>₹{test.price}</span>
              </p>
              {formData.collectionType === 'home' && (
                <p className="flex justify-between mb-1">
                  <span>Home Collection Fee:</span>
                  <span>₹100</span>
                </p>
              )}
              <p className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>Total:</span>
                <span>₹{formData.collectionType === 'home' ? test.price + 100 : test.price}</span>
              </p>
            </div>
            
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-200 disabled:bg-blue-300"
            >
              {submitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPage;

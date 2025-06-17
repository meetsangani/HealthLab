import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Upload, User, Phone, Mail, MapPin, IndianRupee } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, type Test } from '../lib/supabase';
import toast from 'react-hot-toast';

interface BookingForm {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
}

export default function BookTest() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookingForm>();

  useEffect(() => {
    fetchAvailableTests();
    
    // Pre-fill form if user is logged in
    if (user) {
      setValue('customer_name', user.full_name);
      setValue('customer_phone', user.phone);
      setValue('customer_email', user.email);
      setValue('customer_address', user.address);
    }

    // Check if specific test is selected
    const testId = searchParams.get('testId');
    if (testId) {
      // This would select the test if it exists
      fetchSpecificTest(testId);
    }
  }, [user]);

  const fetchAvailableTests = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*, category:categories(*)')
        .order('name');

      if (error) throw error;
      setAvailableTests(data || []);
    } catch (error) {
      // Set mock data for demonstration
      setMockTests();
    }
  };

  const fetchSpecificTest = async (testId: string) => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*, category:categories(*)')
        .eq('id', testId)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedTests([data]);
      }
    } catch (error) {
      console.error('Error fetching specific test:', error);
    }
  };

  const setMockTests = () => {
    const mockTests: Test[] = [
      {
        id: '1',
        name: 'Complete Blood Count (CBC)',
        description: 'Comprehensive blood analysis including RBC, WBC, platelets, and hemoglobin levels',
        price: 300,
        category_id: '1',
        turnaround_time: '24 hours',
        preparation_instructions: 'No special preparation required',
        created_at: '',
      },
      {
        id: '2',
        name: 'Lipid Profile',
        description: 'Cholesterol and triglyceride levels to assess cardiovascular risk',
        price: 450,
        category_id: '1',
        turnaround_time: '24 hours',
        preparation_instructions: '12 hours fasting required',
        created_at: '',
      },
      {
        id: '3',
        name: 'Thyroid Function Test (TSH, T3, T4)',
        description: 'Complete thyroid hormone analysis',
        price: 600,
        category_id: '4',
        turnaround_time: '48 hours',
        preparation_instructions: 'No special preparation required',
        created_at: '',
      },
    ];
    setAvailableTests(mockTests);

    // Auto-select test if testId is provided
    const testId = searchParams.get('testId');
    if (testId) {
      const selectedTest = mockTests.find(test => test.id === testId);
      if (selectedTest) {
        setSelectedTests([selectedTest]);
      }
    }
  };

  const handleTestSelection = (test: Test) => {
    const isSelected = selectedTests.find(t => t.id === test.id);
    if (isSelected) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handlePrescriptionUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setPrescription(file);
      toast.success('Prescription uploaded successfully');
    }
  };

  const totalAmount = selectedTests.reduce((sum, test) => sum + test.price, 0);

  const onSubmit = async (data: BookingForm) => {
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test');
      return;
    }

    if (!user && !data.customer_email) {
      toast.error('Please provide email address');
      return;
    }

    try {
      setLoading(true);

      // Upload prescription if provided
      let prescriptionUrl = null;
      if (prescription) {
        const fileExt = prescription.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('prescriptions')
          .upload(fileName, prescription);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('prescriptions')
          .getPublicUrl(fileName);
        
        prescriptionUrl = urlData.publicUrl;
      }

      // Create booking
      const bookingData = {
        user_id: user?.id || null,
        test_ids: selectedTests.map(test => test.id),
        total_amount: totalAmount,
        booking_date: data.booking_date,
        booking_time: data.booking_time,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        customer_address: data.customer_address,
        notes: data.notes,
        prescription_url: prescriptionUrl,
        status: 'pending' as const,
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast.success('Booking confirmed successfully!');
      navigate(user ? '/dashboard' : '/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to book test');
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Test</h1>
          <p className="text-xl text-gray-600">
            Select tests, provide your details, and schedule your appointment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Tests</h2>
              <div className="space-y-3">
                {availableTests.map((test) => (
                  <div
                    key={test.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTests.find(t => t.id === test.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleTestSelection(test)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{test.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {test.turnaround_time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-lg font-semibold text-gray-900">
                          <IndianRupee className="h-4 w-4" />
                          <span>{test.price}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!selectedTests.find(t => t.id === test.id)}
                          onChange={() => handleTestSelection(test)}
                          className="mt-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('customer_name', { required: 'Name is required' })}
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.customer_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('customer_phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Please enter a valid 10-digit phone number',
                          },
                        })}
                        type="tel"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.customer_phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('customer_email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      type="email"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.customer_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.customer_email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      {...register('customer_address', { required: 'Address is required' })}
                      rows={3}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter your full address"
                    />
                  </div>
                  {errors.customer_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.customer_address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('booking_date', { required: 'Date is required' })}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {errors.booking_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.booking_date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('booking_time', { required: 'Time is required' })}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.booking_time && (
                      <p className="mt-1 text-sm text-red-600">{errors.booking_time.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Prescription (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handlePrescriptionUpload}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload PDF, JPG, or PNG files (max 5MB)
                  </p>
                  {prescription && (
                    <p className="mt-1 text-sm text-green-600">
                      Prescription uploaded: {prescription.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Any special instructions or notes"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || selectedTests.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Booking...' : `Confirm Booking - ₹${totalAmount}`}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              {selectedTests.length > 0 ? (
                <div className="space-y-3">
                  {selectedTests.map((test) => (
                    <div key={test.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{test.name}</p>
                        <p className="text-sm text-gray-500">{test.turnaround_time}</p>
                      </div>
                      <div className="flex items-center text-gray-900">
                        <IndianRupee className="h-4 w-4" />
                        <span>{test.price}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <div className="flex items-center text-lg font-semibold text-gray-900">
                        <IndianRupee className="h-5 w-5" />
                        <span>{totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No tests selected yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
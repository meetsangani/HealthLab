import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { testsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import BookButton from '../components/BookButton';

const TestDetailsPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const data = await testsAPI.getTestById(id, token);
        setTest(data);
      } catch (err) {
        setError("Failed to load test details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id, token]);

  if (loading) return <div className="container mx-auto p-4">Loading test details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error loading test: {error}</div>;
  if (!test) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Test Not Found</h1>
          <p className="text-gray-600 mb-4">The test you're looking for doesn't exist.</p>
          <Link to="/tests" className="text-primary hover:underline">
            Back to Tests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/tests" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tests
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.name}</h1>
              <p className="text-gray-600">{test.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">₹{test.price}</div>
              <div className="text-sm text-gray-500">Price</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Test Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{test.category || 'General'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sample Type:</span>
                  <span className="font-medium">{test.sampleType || 'Blood'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Report Time:</span>
                  <span className="font-medium">{test.reportDeliveryTime || '24 hours'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <div className="text-gray-600">
                {test.requirements || 'No special requirements'}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <BookButton 
              testId={id} 
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold"
            >
              Book This Test
            </BookButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsPage;

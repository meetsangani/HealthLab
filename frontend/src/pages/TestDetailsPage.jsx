import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { testsAPI } from '../utils/api';
import BookButton from '../components/BookButton';

const TestDetailsPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const data = await testsAPI.getTestById(id);
        setTest(data);
      } catch (err) {
        setError("Failed to load test details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  if (loading) return <div className="container mx-auto p-4">Loading test details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!test) return <div className="container mx-auto p-4">Test not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{test.name || "Test"}</h1>
        <div className="mb-4">
          <p className="text-gray-700">{test.description || "No description available."}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Price</h3>
            <p className="text-lg">₹{test.price ?? "N/A"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Sample Type</h3>
            <p>{test.sampleType || 'Not specified'}</p>
          </div>
        </div>
        {test.instructions && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Preparation Instructions</h3>
            <p className="text-gray-700">{test.instructions}</p>
          </div>
        )}
        <BookButton testId={id} />
      </div>
    </div>
  );
};

export default TestDetailsPage;

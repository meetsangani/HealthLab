import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import BookButton from '../components/BookButton';

const TestCatalogPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await testsAPI.getAllTests();
        setTests(data);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to load tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Filter tests based on search term
  const filteredTests = tests.filter(test => 
    test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (test.description && test.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBookTest = (testId) => {
    if (isAuthenticated) {
      navigate(`/booking?testId=${testId}`);
    } else {
      navigate(`/login?redirect=/booking?testId=${testId}`);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading tests...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Tests</h1>
      
      {/* Search bar */}
      <div className="mb-6">
        <input 
          type="text"
          placeholder="Search tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      {filteredTests.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tests found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <div key={test._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{test.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{test.description || 'No description available'}</p>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-700">
                    <span className="font-bold">₹{test.price}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {test.duration || 'Results in 24-48 hours'}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link 
                    to={`/tests/${test._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </Link>
                  <div>
                    <BookButton testId={test._id} className="py-1 px-4 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestCatalogPage;

import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookButton = ({ testId, className, children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookTest = () => {
    if (isAuthenticated) {
      navigate(testId ? `/booking?testId=${testId}` : '/tests');
    } else {
      navigate(testId ? `/login?redirect=/booking?testId=${testId}` : '/login?redirect=/tests');
    }
  };

  return (
    <button 
      onClick={handleBookTest}
      className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition duration-200 btn-enhanced btn-shine ${className || ''}`}
    >
      {children || 'Book Now'}
    </button>
  );
};

export default BookButton;

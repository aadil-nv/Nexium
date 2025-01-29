import { FaCircle } from 'react-icons/fa';

const LoadingDotsSpinner = () => (
  <div className="spinner-container flex space-x-2 justify-center">
    <FaCircle className="animate-bounce text-white" style={{ width: '1rem', height: '1rem' }} />
    <FaCircle className="animate-bounce text-white" style={{ width: '1rem', height: '1rem', animationDelay: '0.1s' }} />
    <FaCircle className="animate-bounce text-white" style={{ width: '1rem', height: '1rem', animationDelay: '0.2s' }} />
  </div>
);

export default LoadingDotsSpinner;

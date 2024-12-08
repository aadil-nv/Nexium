import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { AiOutlineCheckCircle } from 'react-icons/ai'; // Checkmark icon (from react-icons)
import ReactLoading from 'react-loading'; // Importing react-loading

type SuccessPageProps = {
  message: string;
  onClose: () => void;
};

const SuccessPage: React.FC<SuccessPageProps> = ({ message, onClose }) => {
  const [loading, setLoading] = useState(true); // State to handle loading status

  useEffect(() => {
    // Simulate loading process (e.g., network request)
    const timer = setTimeout(() => {
      setLoading(false); // Change loading status after 2 seconds (simulate loading)
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  // Animation for checkmark (scale and bounce effect)
  const checkmarkBounce = useSpring({
    transform: 'scale(1)',
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(1)' },
    config: { tension: 150, friction: 12 },
  });

  // Fade-in animation for the entire success page
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { tension: 200, friction: 20 },
  });

  // Slide-in effect for text and button
  const slideIn = useSpring({
    transform: 'translateY(0px)',
    from: { transform: 'translateY(20px)' },
    to: { transform: 'translateY(0px)' },
    config: { tension: 170, friction: 26 },
  });

  return (
    <animated.div style={fadeIn} className="modal-overlay">
      <div className="modal-container">
        {/* Show loading animation if still loading */}
        {loading ? (
          <div className="loading-container">
            <ReactLoading type="spin" color="#6772E5" height={100} width={100} />
          </div>
        ) : (
          <>
            {/* Checkmark Animation */}
            <animated.div style={checkmarkBounce} className="checkmark-icon">
              <AiOutlineCheckCircle size={80} color="#4CAF50" />
            </animated.div>

            <animated.h1 style={slideIn}>Payment Successful!</animated.h1>
            <animated.p style={slideIn}>{message}</animated.p>

            <animated.button onClick={onClose} style={slideIn} className="close-button">
              Close
            </animated.button>
          </>
        )}
      </div>
    </animated.div>
  );
};

export default SuccessPage;

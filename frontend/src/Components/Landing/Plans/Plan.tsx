import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slices/businessOwnerSlice';
import { fetchPlans, createCheckoutSession } from '../../../api/authApi';

type Plan = {
  _id: string;
  planName: string;
  price: number;
  features: string[];
  isActive: boolean; // Added `isActive` for clarity
};

const PlanSelection: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const email = (useLocation().state as { email: string })?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripePromise = loadStripe('pk_test_51QA84MG0KgrlY5FBKX5uMqGIPF0QRwCB52FMUeaO4mMIqlaHjWaellTk26kdZYqYgM1USvDyz7jwfoAIL5Wovdpw00AYg8dWct');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlans = await fetchPlans();
        const activePlans = fetchedPlans.filter((plan: Plan) => plan.isActive); // Filter active plans
        setPlans(activePlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchData();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) return alert('Please select a plan first.');
    try {
      const stripe = await stripePromise;
      if (!stripe) return alert('Stripe failed to load. Please try again.');

      const data = await createCheckoutSession(email, selectedPlan);

      if (data.planName === 'Trial') {
        dispatch(login({ role: 'businessOwner', isAuthenticated: true }));
        navigate('/business-owner/dashboard');
      } else {
        const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (error) console.error('Payment error:', error.message);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-black">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Choose Your Plan</h1>
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`p-6 shadow-lg rounded-xl transition-transform duration-300 ${selectedPlan?._id === plan._id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`}
            onClick={() => setSelectedPlan(plan)}
          >
            <h2 className={`text-2xl font-bold ${selectedPlan?._id === plan._id ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>{plan.planName}</h2>
            <p className={`text-xl font-semibold ${selectedPlan?._id === plan._id ? 'text-gray-200' : 'text-gray-900 dark:text-gray-300'}`}>${plan.price}/month</p>
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => <li key={idx}><span className="mr-2">✅</span>{feature}</li>)}
            </ul>
            <button
              className={`w-full py-2 mt-6 rounded-lg ${selectedPlan?._id === plan._id ? 'bg-yellow-500 text-gray-900' : 'bg-blue-500 text-white'}`}
              onClick={() => setSelectedPlan(plan)}
            >
              {selectedPlan?._id === plan._id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      <button className="mt-8 py-3 px-10 bg-green-500 text-white text-xl rounded-lg" onClick={handlePayment}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default PlanSelection;

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserRole } from '../../../redux/slices/menuSlice';
import { login } from '../../../redux/slices/businessOwnerSlice';

type Plan = { _id: string; planName: string; price: number; features: string[] };

const PlanSelection: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const email = (useLocation().state as { email: string })?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setStripePromise(loadStripe('pk_test_51QA84MG0KgrlY5FBKX5uMqGIPF0QRwCB52FMUeaO4mMIqlaHjWaellTk26kdZYqYgM1USvDyz7jwfoAIL5Wovdpw00AYg8dWct'));
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:3000/superAdmin/api/subscription/get-subscription');
        response.data.success && setPlans(response.data.subscriptions);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, []);

  console.log("plan is ---",plans);
  

  const handlePayment = async () => {
    if (!selectedPlan) return alert('Please select a plan first.');
    try {
      const stripe = await stripePromise;
      const { data } = await axios.post(
        'http://localhost:3000/authentication/api/business-owner/create-checkout-session',
        { email, plan: selectedPlan, amount: selectedPlan.price * 100, currency: 'usd' },
        { withCredentials: true }
      );

      
      if (data.planName=== 'Trial') {
        console.log("????????????????????????????????????????????????");
        dispatch(login({ role: 'businessOwner', token: data.accessToken }));
        navigate('/business-owner/dashboard');
      } else {
        const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
       
        error && console.error('Error in payment redirection:', error.message);
      }
    } catch (error) {
      console.error('Error in processing payment:', error);
      alert('Payment processing error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-black transition-colors duration-300">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Choose Your Plan</h1>
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`transform hover:scale-105 transition-transform duration-300 rounded-xl p-6 shadow-lg ${
              selectedPlan?._id === plan._id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'
            } hover:shadow-2xl min-h-[500px] overflow-auto`}
            onClick={() => setSelectedPlan(plan)}
          >
            <h2 className={`text-2xl font-bold mb-4 ${selectedPlan?._id === plan._id ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
              {plan.planName}
            </h2>
            <p className={`text-xl font-semibold mb-6 ${selectedPlan?._id === plan._id ? 'text-gray-200' : 'text-gray-900 dark:text-gray-300'}`}>
              ${plan.price}/month
            </p>
            <ul className={`space-y-2 ${selectedPlan?._id === plan._id ? 'text-gray-200' : 'text-gray-700 dark:text-gray-400'}`}>
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="mr-2 text-white">✅</span> {feature}
                </li>
              ))}
            </ul>
            <button
              className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 mt-6 w-full max-w-xs py-2 rounded-lg text-lg font-bold ${
                selectedPlan?._id === plan._id ? 'bg-yellow-500 text-gray-900' : 'bg-blue-500 text-white dark:bg-blue-600'
              } hover:bg-opacity-90 transition-all duration-300`}
              onClick={() => setSelectedPlan(plan)}
            >
              {selectedPlan?._id === plan._id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-8 py-3 px-10 bg-green-500 text-white text-xl rounded-lg shadow-lg hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 hover:shadow-2xl transition-all duration-300"
        onClick={handlePayment}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default PlanSelection;

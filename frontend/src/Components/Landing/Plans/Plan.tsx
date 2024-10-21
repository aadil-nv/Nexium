import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setUserRole } from '../../../features/menuSlice'; // Import the action
import {login} from '../../../features/businessOwnerSlice';

type Plan = {
  id: number;
  name: string;
  price: string;
  features: string[];
};

type LocationState = {
  email: string;
};

const plans: Plan[] = [
  {
    id: 1,
    name: 'Trial',
    price: '$0/month',
    features: [
      'Access to basic features',
      'Limited user support',
      'Community access only',
      '1 project limitation',
    ],
  },
  {
    id: 2,
    name: 'Standard',
    price: '$20/month',
    features: [
      'All basic features',
      'Priority email support',
      'Access to all integrations',
      'Up to 5 projects',
      'Customizable dashboard',
    ],
  },
  {
    id: 3,
    name: 'Premium',
    price: '$30/month',
    features: [
      'All Standard features',
      '24/7 dedicated support',
      'Unlimited projects',
      'Advanced reporting & analytics',
      'Team collaboration tools',
      'Early access to new features',
    ],
  },
];

const PlanSelection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const location = useLocation();
  const email = (location.state as LocationState)?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch

  useEffect(() => {
    setStripePromise(loadStripe('pk_test_51QA84MG0KgrlY5FBKX5uMqGIPF0QRwCB52FMUeaO4mMIqlaHjWaellTk26kdZYqYgM1USvDyz7jwfoAIL5Wovdpw00AYg8dWct'));
  }, []);

  const selectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      return alert('Please select a plan first.');
    }

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load.');
      }

      const response = await axios.post('http://localhost:7000/api/business-owner/create-checkout-session', {
        email,
        plan: selectedPlan,
        amount: selectedPlan.id === 2 ? 2000 : 3000, 
        currency: 'usd',
      });

      console.log("PLAN RES",response);
      const data = await response.data
      if(data.planId === 1){
        dispatch(login({
          role: 'business-owner', 
          token: data.accessToken, 
          isAuthenticated: true,
      }));
       
        navigate('/business-owner/dashboard');
      }
      

      const { sessionId } = response.data;

      if (sessionId) {
        // Redirect to Stripe Checkout for paid plans
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error in payment redirection:', error.message);
        }
      }
    } catch (error) {
      console.error('Error in processing payment:', error);
      alert('Payment processing error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-black transition-colors duration-300">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-300">
        Choose Your Plan
      </h1>
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`transform hover:scale-105 transition-transform duration-300 rounded-xl p-6 shadow-lg ${selectedPlan?.id === plan.id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'} hover:shadow-2xl`}
            onClick={() => selectPlan(plan)}
          >
            <div className="relative">
              <h2 className={`text-2xl font-bold mb-4 ${selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                {plan.name}
              </h2>
              <p className={`text-xl font-semibold mb-6 ${selectedPlan?.id === plan.id ? 'text-gray-200' : 'text-gray-900 dark:text-gray-300'}`}>
                {plan.price}
              </p>
              <ul className={`space-y-2 ${selectedPlan?.id === plan.id ? 'text-gray-200' : 'text-gray-700 dark:text-gray-400'}`}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="mr-2 text-white">✅</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`mt-6 w-full py-2 rounded-lg text-lg font-bold ${selectedPlan?.id === plan.id ? 'bg-yellow-500 text-gray-900' : 'bg-blue-500 text-white dark:bg-blue-600'} hover:bg-opacity-90 transition-all duration-300`}
              onClick={() => selectPlan(plan)}
            >
              {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
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

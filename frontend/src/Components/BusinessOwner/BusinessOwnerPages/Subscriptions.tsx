import React, { useState } from 'react';


interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  features: string[];
}

const SubscriptionPage = () => {

  // Sample subscription plans (replace with actual data as needed)
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 1,
      name: 'Basic Plan',
      price: '$9.99/month',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
    },
    {
      id: 2,
      name: 'Standard Plan',
      price: '$19.99/month',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    },
    {
      id: 3,
      name: 'Premium Plan',
      price: '$29.99/month',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Subscription Plan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
              selectedPlan?.id === plan.id ? 'border-2 border-blue-600' : ''
            }`}
            onClick={() => handleSelectPlan(plan)}
          >
            <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
            <p className="text-lg font-bold text-gray-600">{plan.price}</p>
            <h3 className="mt-4 text-md font-semibold text-gray-700">Features:</h3>
            <ul className="list-disc list-inside">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-gray-600">{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-4 w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Selected Plan</h2>
          <p className="text-lg font-semibold text-gray-600">{selectedPlan.name}</p>
          <p className="text-md text-gray-500">{selectedPlan.price}</p>
          <h3 className="mt-4 text-md font-semibold text-gray-700">Features:</h3>
          <ul className="list-disc list-inside">
            {selectedPlan.features.map((feature, index) => (
              <li key={index} className="text-gray-600">{feature}</li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-300"
              onClick={() => alert(`You have upgraded to ${selectedPlan.name}`)}
            >
              Upgrade
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
              onClick={() => setSelectedPlan(null)} // Change plan action
            >
              Change Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;

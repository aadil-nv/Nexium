import React, { useState, useEffect } from 'react';
import { Card, Col, Button, Tag, Empty } from 'antd';
import { businessOwnerInstance } from '../../../services/businessOwnerInstance';

interface SubscriptionPlan {
  _id: string;
  subscriptionName: string;
  subscriptiondescription: string;
  subscriptionPrice: number;
  subscriptionPlanType: string;
  durationInMonths: number;
  features: string[];
  isActive: boolean;
}

const SubscriptionPage: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [allSubscriptionPlans, setAllSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    businessOwnerInstance
      .get('/businessOwner/api/subscription/get-subscription')
      .then((response) => {
        console.log('Single Subscription Response:', response.data);
        if (Array.isArray(response.data)) {
          setSubscriptionPlans(response.data);
        } else if (response.data && typeof response.data === 'object') {
          setSubscriptionPlans([response.data]);
        }
      })
      .catch((error) => console.error('Error fetching subscription plans:', error));
  
    businessOwnerInstance
      .get('/businessOwner/api/subscription/get-all-subscriptions')
      .then((response) => {
        console.log('All Subscriptions Response:', response.data);
        if (response.data) {
          setAllSubscriptionPlans(response.data.newSubscription);
        }
      })
      .catch((error) => console.error('Error fetching all subscription plans:', error));
  }, []);
  

  return (
    <div className="subscription-container">
      <h1 className="text-center text-2xl font-semibold my-6 text-blue-700">
        Available Subscription Plans
      </h1>

      {subscriptionPlans && subscriptionPlans.length > 0 ? (
        <div className="subscription-grid grid grid-cols-3 gap-4">
          {subscriptionPlans.map((plan) => (
            <Col key={plan._id}>
              <Card
                hoverable
                className="shadow-md rounded-lg p-4"
                cover={plan.isActive ? <Tag color="gold">Popular</Tag> : null}
              >
                <h2 className="text-xl font-semibold text-gray-900">{plan.subscriptionName}</h2>
                <p className="text-lg font-bold text-green-700">₹{plan.subscriptionPrice}</p>
                <h3 className="mt-4 text-md font-semibold text-gray-800">Features:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Card>
            </Col>
          ))}
        </div>
      ) : (
        <Empty
          className="my-12"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span className="text-lg text-gray-700">No Subscription Plans Available</span>}
        />
      )}

      <h2 className="text-xl font-semibold text-blue-700 mt-12">
        Other Subscription Plans
      </h2>
      {allSubscriptionPlans && allSubscriptionPlans.length > 0 ? (
        <div className="other-plans-grid grid grid-cols-3 gap-4 mt-6">
          {allSubscriptionPlans.map((plan) => (
            <Card
              key={plan._id}
              hoverable
              className="shadow-md rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">{plan.subscriptionName}</h3>
              <p className="text-gray-700">{plan.subscriptiondescription}</p>
              <p className="text-green-700 font-bold">₹{plan.subscriptionPrice}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          className="mt-6"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span className="text-lg text-gray-700">No Other Plans Available</span>}
        />
      )}
    </div>
  );
};

export default SubscriptionPage;

import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, Modal, Tag, Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { businessOwnerInstance } from '../../../services/businessOwnerInstance';
import DemoTable from "./DemoTable";
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notification

interface SubscriptionPlan {
  _id: string;
  planName: string;
  description: string;
  price: number;
  planType: string;
  durationInMonths: number;
  features: string[];
  isActive: boolean;
}

const SubscriptionPage: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [allSubscriptionPlans, setAllSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [visiblePlans, setVisiblePlans] = useState<SubscriptionPlan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const stripePromise = loadStripe('pk_test_51QA84MG0KgrlY5FBKX5uMqGIPF0QRwCB52FMUeaO4mMIqlaHjWaellTk26kdZYqYgM1USvDyz7jwfoAIL5Wovdpw00AYg8dWct');

  useEffect(() => {
    // Fetch subscription plans
    businessOwnerInstance.get('/businessOwner/api/subscription/get-subscription')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setSubscriptionPlans(data);
        if (data.length === 1) setCurrentPlan(data[0]);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(console.error);

    businessOwnerInstance.get('/businessOwner/api/subscription/get-all-subscriptions')
      .then((response) => setAllSubscriptionPlans(response.data?.newSubscription || []))
      .catch(console.error);
  }, []);


  const handleUpgrade = () => {
    if (currentPlan) {
      const currentIndex = allSubscriptionPlans.findIndex(plan => plan._id === currentPlan._id);
      
      // Filter out the Trial plan if the current plan is not Trial, Basic, or Premium
      const availablePlans = allSubscriptionPlans.filter(plan => 
        plan.planName !== 'Trial' &&
        ((currentPlan.planName === 'Basic' || currentPlan.planName === 'Premium') ? true : plan._id !== currentPlan._id)
      );

      // Set visible plans for upgrade (plans after the current plan)
      setVisiblePlans(availablePlans.slice(currentIndex + 1, currentIndex + 3));
      setModalVisible(true);
    }
  };

  const handleDegrade = () => {
    if (currentPlan) {
      const currentIndex = allSubscriptionPlans.findIndex(plan => plan._id === currentPlan._id);
      
      // Filter out the Trial plan if the current plan is not Trial
      const availablePlans = allSubscriptionPlans.filter(plan =>
        plan.planName !== 'Trial' &&
        ((currentPlan.planName === 'Trial') ? true : plan._id !== currentPlan._id)
      );

      // Set visible plans for degrade (plans before the current plan)
      setVisiblePlans(availablePlans.slice(Math.max(0, currentIndex - 2), currentIndex));
      setModalVisible(true);
    }
  };

  const handleChoosePlan = (plan: SubscriptionPlan) => {
    console.log("Selected plan:", plan);
    businessOwnerInstance.post('/payment/api/businessowner-payment/upgrade-plan', { plan: plan })
      .then(response => {
        // Show success toast
        toast.success('Plan upgraded successfully!');
        setModalVisible(false); // Close the modal after successful upgrade
      })
      .catch(error => {
        // Show error toast
        toast.error('Error upgrading plan. Please try again.');
        console.error(error);
      });
  };

  return (
    <div className="px-4 py-6">
      <motion.h1
        className="text-center text-2xl font-semibold my-6 text-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Available Subscription Plans
      </motion.h1>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Subscription Plans */}
        <div className="w-full md:w-2/3">
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} /> // Show skeleton loader
          ) : subscriptionPlans.length > 0 ? (
            <motion.div
              className="grid gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {subscriptionPlans.map(plan => (
                <Card key={plan._id} hoverable className="shadow-lg rounded-lg p-4" cover={plan.isActive ? <Tag color="gold">Active</Tag> : null}>
                  <h2 className="text-xl font-semibold text-gray-900">{plan.planName}</h2>
                  <p className="text-lg font-bold text-green-700">${plan.price}</p>
                  <h3 className="mt-4 text-md font-semibold text-gray-800">Features:</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {plan.features.map((feature, index) => <li key={index}>{feature}</li>)}
                  </ul>
                  <div className="mt-4 flex space-x-4">
                    <Button type="primary" onClick={handleUpgrade}>Upgrade</Button>
                    <Button type="default" onClick={handleDegrade}>Degrade</Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          ) : (
            <Empty className="my-12" image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Subscription Plans Available" />
          )}
        </div>

        {/* Payment Card */}
        <div className="w-full md:w-2/3">
          <Card className="shadow-md rounded-lg p-6 h-full flex flex-col justify-between" title="Next Month's Bill">
            <div>
              <p className="text-gray-700 font-semibold">Due Date: January 1, 2025</p>
              <p className="text-xl font-bold text-green-700">Amount: $99.99</p>
            </div>
            <Button type="primary" className="mt-4 w-full self-end">Pay Now</Button>
          </Card>
        </div>
      </div>

      <div>
        <DemoTable />
      </div>

      {/* Modal for Plan Selection */}
      <Modal title="Choose a Plan" visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        {visiblePlans.length > 0 ? (
          visiblePlans.map(plan => (
            <Card key={plan._id} className="mb-4" hoverable actions={[<Button type="primary" onClick={() => handleChoosePlan(plan)}>Choose Plan</Button>]} >
              <h3 className="text-lg font-semibold">{plan.planName}</h3>
              <p className="text-gray-700">{plan.description}</p>
              <p className="text-green-700 font-bold">${plan.price}</p>

              {/* Display Features */}
              <h4 className="mt-4 text-md font-semibold text-gray-800">Features:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {plan.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            </Card>
          ))
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Plans Available" />
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionPage;

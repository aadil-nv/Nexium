import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, Modal, Tag, Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { businessOwnerInstance } from '../../../services/businessOwnerInstance';
import DemoTable from './InvoiseTable';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

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

interface Invoice {
  id: string;
  created: number;
  amount_paid: number;
  amount_due: number;
  invoice_pdf: string;
}

const SubscriptionPage: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [allSubscriptionPlans, setAllSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [visiblePlans, setVisiblePlans] = useState<SubscriptionPlan[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [stripeLoading, setStripeLoading] = useState<boolean>(false); 
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const stripePromise = loadStripe('pk_test_51QA84MG0KgrlY5FBKX5uMqGIPF0QRwCB52FMUeaO4mMIqlaHjWaellTk26kdZYqYgM1USvDyz7jwfoAIL5Wovdpw00AYg8dWct');

  useEffect(() => {
    businessOwnerInstance
      .get('/businessOwner-service/api/subscription/get-subscription')
      .then((response) => {
        const data: SubscriptionPlan[] = Array.isArray(response.data) ? response.data : [response.data];
        setSubscriptionPlans(data);
        if (data.length === 1) setCurrentPlan(data[0]);
        setLoading(false);
      })
      .catch(console.error);

    businessOwnerInstance
      .get('/businessOwner-service/api/subscription/get-all-subscriptions')
      .then((response) => setAllSubscriptionPlans(response.data.subscriptions))
      .catch(console.error);

    businessOwnerInstance
      .get('/businessOwner-service/api/subscription/invoices')
      .then((response) => setInvoiceData(response.data))
      .catch(console.error);
  }, []);

  const handleUpgrade = () => {
    if (currentPlan) {
      let upgradePlans: SubscriptionPlan[] = [];
      if (currentPlan.planName === 'Trial') {
        upgradePlans = allSubscriptionPlans.filter(plan => plan.planName === 'Basic' || plan.planName === 'Premium');
      } else if (currentPlan.planName === 'Basic') {
        upgradePlans = allSubscriptionPlans.filter(plan => plan.planName === 'Premium');
      } else if (currentPlan.planName === 'Premium') {
        upgradePlans = allSubscriptionPlans.filter(plan => plan.planName === 'Basic');
      }
      setVisiblePlans(upgradePlans);
      setModalVisible(true);
    }
  };

  const handleChoosePlan = async (plan: SubscriptionPlan) => {
    setStripeLoading(true);
    const stripe = await stripePromise;
    if (!stripe) {
      toast.error('Stripe initialization failed. Please try again.');
      setStripeLoading(false);
      return;
    }

    try {
      const response = await businessOwnerInstance.post(
        '/payment-service/api/businessowner-payment/upgrade-plan',
        { plan }
      );

      if (response.data.result.session.id) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.result.session.id,
        });

        if (error) {
          toast.error(`Payment error: ${error.message}`);
        }
      } else {
        toast.error('Error upgrading plan. Please try again.');
      }
    } catch (error) {
      toast.error('Error upgrading plan. Please try again.');
      console.error('Error:', error);
    } finally {
      setStripeLoading(false);
    }
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
        <div className="w-full md:w-2/3">
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : subscriptionPlans.length > 0 ? (
            <motion.div
              className="grid gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan._id}
                  hoverable
                  className="shadow-lg rounded-lg p-4"
                  cover={plan.isActive ? <Tag color="gold">Active</Tag> : null}
                >
                  <h2 className="text-xl font-semibold text-gray-900">{plan.planName}</h2>
                  <p className="text-lg font-bold text-green-700">${plan.price}</p>
                  <h3 className="mt-4 text-md font-semibold text-gray-800">Features:</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex space-x-4">
                    <Button type="primary" onClick={handleUpgrade}>
                      Upgrade
                    </Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          ) : (
            <Empty className="my-12" image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Subscription Plans Available" />
          )}
        </div>
      </div>

      <div>
        <DemoTable invoiceData={invoiceData} />
      </div>

      <Modal title="Choose a Plan" visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        {visiblePlans.length > 0 ? (
          visiblePlans.map((plan) => (
            <Card
              key={plan._id}
              className="mb-4"
              hoverable
              actions={[<Button type="primary" onClick={() => handleChoosePlan(plan)} loading={stripeLoading}>Choose Plan</Button>]}
            >
              <h3 className="text-lg font-semibold">{plan.planName}</h3>
              <p className="text-gray-700">{plan.description}</p>
              <p className="text-green-700 font-bold">${plan.price}</p>

              <h4 className="mt-4 text-md font-semibold text-gray-800">Features:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
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
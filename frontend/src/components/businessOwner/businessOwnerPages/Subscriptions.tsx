import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, Modal, Tag, Skeleton } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { businessOwnerInstance } from '../../../services/businessOwnerInstance';
import DemoTable from './InvoiseTable';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { 
  UserOutlined, 
  TeamOutlined, 
  ProjectOutlined, 
  CustomerServiceOutlined,
  CrownOutlined,
  DollarOutlined
} from '@ant-design/icons';

interface SubscriptionPlan {
  _id: string;
  planName: string;
  description: string;
  price: number;
  planType: string;
  durationInMonths: number;
  features: string[];
  isActive: boolean;
  employeeCount?: number | null;
  managerCount?: number | null;
  projectCount?: number | null;
  serviceRequestCount?: number | null;
}

interface Invoice {
  id: string;
  created: number;
  amount_paid: number;
  amount_due: number;
  invoice_pdf: string;
}

const formatCount = (count: number | null | undefined) => {
  if (count === null || count === undefined) return '0';
  return count > 900 ? 'Unlimited' : count.toString();
};

const PlanCounts: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => (
  <motion.div 
    className="grid grid-cols-2 gap-4 mt-4"
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
  >
    <motion.div variants={countItemVariants} className="flex items-center gap-2">
      <UserOutlined className="text-blue-500" />
      <span>Employees: {formatCount(plan.employeeCount)}</span>
    </motion.div>
    <motion.div variants={countItemVariants} className="flex items-center gap-2">
      <TeamOutlined className="text-green-500" />
      <span>Managers: {formatCount(plan.managerCount)}</span>
    </motion.div>
    <motion.div variants={countItemVariants} className="flex items-center gap-2">
      <ProjectOutlined className="text-purple-500" />
      <span>Projects: {formatCount(plan.projectCount)}</span>
    </motion.div>
    <motion.div variants={countItemVariants} className="flex items-center gap-2">
      <CustomerServiceOutlined className="text-orange-500" />
      <span>Service Requests: {formatCount(plan.serviceRequestCount)}</span>
    </motion.div>
  </motion.div>
);

const countItemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
    const fetchData = async () => {
      try {
        const [subscriptionResponse, allSubscriptionsResponse, invoicesResponse] = await Promise.all([
          businessOwnerInstance.get('/businessOwner-service/api/subscription/get-subscription'),
          businessOwnerInstance.get('/businessOwner-service/api/subscription/get-all-subscriptions'),
          businessOwnerInstance.get('/businessOwner-service/api/subscription/invoices')
        ]);

        const subscriptionData: SubscriptionPlan[] = Array.isArray(subscriptionResponse.data) 
          ? subscriptionResponse.data 
          : [subscriptionResponse.data];
        
        setSubscriptionPlans(subscriptionData);
        if (subscriptionData.length === 1) setCurrentPlan(subscriptionData[0]);
        setAllSubscriptionPlans(allSubscriptionsResponse.data.subscriptions);
        setInvoiceData(invoicesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = () => {
    if (currentPlan) {
      const upgradePlans = allSubscriptionPlans.filter(plan => {
        if (currentPlan.planName === 'Trial') {
          return plan.planName === 'Basic' || plan.planName === 'Premium';
        } else if (currentPlan.planName === 'Basic') {
          return plan.planName === 'Premium';
        } else if (currentPlan.planName === 'Premium') {
          return plan.planName === 'Basic';
        }
        return false;
      });
      setVisiblePlans(upgradePlans);
      setModalVisible(true);
    }
  };

  const handleChoosePlan = async (plan: SubscriptionPlan) => {
    setStripeLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe initialization failed');
      }

      const response = await businessOwnerInstance.post(
        '/payment-service/api/businessowner-payment/upgrade-plan',
        { plan }
      );

      if (response.data.result.session.id) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.result.session.id,
        });
        if (error) throw new Error(error.message);
      } else {
        throw new Error('Invalid session ID');
      }
    } catch (error) {
      toast.error(`Payment error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <motion.h1
        className="text-center text-2xl font-semibold my-6 text-blue-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CrownOutlined className="mr-2" />
        Available Subscription Plans
      </motion.h1>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-2/3">
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : subscriptionPlans.length > 0 ? (
            <motion.div
              className="grid gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {subscriptionPlans.map((plan) => (
                <motion.div key={plan._id} variants={cardVariants}>
                  <Card
                    hoverable
                    className="shadow-lg rounded-lg p-4"
                    cover={plan.isActive ? <Tag color="gold" icon={<CrownOutlined />}>Active</Tag> : null}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-xl font-semibold text-gray-900">{plan.planName}</h2>
                      <p className="text-lg font-bold text-green-700">
                        <DollarOutlined className="mr-1" />${plan.price}
                      </p>
                      <h3 className="mt-4 text-md font-semibold text-gray-800">Features:</h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {plan.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <PlanCounts plan={plan} />
                      <div className="mt-4 flex space-x-4">
                        <Button type="primary" onClick={handleUpgrade}>
                          Upgrade
                        </Button>
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Empty className="my-12" image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Subscription Plans Available" />
          )}
        </div>
      </div>

      <div className="mt-8">
        <DemoTable invoiceData={invoiceData} />
      </div>

      <Modal 
        title={
          <div className="flex items-center">
            <CrownOutlined className="mr-2 text-yellow-500" />
            Choose a Plan
          </div>
        }
        visible={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        footer={null}
        width={700}
      >
        <AnimatePresence>
          {visiblePlans.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {visiblePlans.map((plan) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="mb-4"
                    hoverable
                    actions={[
                      <Button 
                        type="primary" 
                        onClick={() => handleChoosePlan(plan)} 
                        loading={stripeLoading}
                        icon={<CrownOutlined />}
                      >
                        Choose Plan
                      </Button>
                    ]}
                  >
                    <h3 className="text-lg font-semibold">{plan.planName}</h3>
                    <p className="text-gray-700">{plan.description}</p>
                    <p className="text-green-700 font-bold">
                      <DollarOutlined className="mr-1" />${plan.price}
                    </p>
                    <h4 className="mt-4 text-md font-semibold text-gray-800">Features:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <PlanCounts plan={plan} />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Plans Available" />
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default SubscriptionPage;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';
import { fetchPlans, createCheckoutSession } from '../../../api/authApi';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Users, 
  Briefcase, 
  UserCog, 
  FileText,
  ChevronRight,
  Zap,
  CheckCircle,
  XCircle,
  RefreshCw,
  Home
} from 'lucide-react';

type Plan = {
  _id: string;
  planName: string;
  description: string;
  price: number;
  planType: "Trial" | "Basic" | "Premium";
  durationInMonths: number;
  features: string[];
  employeeCount?: number | null;
  managerCount?: number | null;
  projectCount?: number | null;
  serviceRequestCount?: number | null;
  isActive: boolean;
};

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failure';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const successVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.5,
    y: 100
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.6
    }
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: -100,
    transition: {
      duration: 0.3
    }
  }
};

const PlanSelection: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const email = (useLocation().state as { email: string })?.email;
 
  const stripePromise = loadStripe('pk_test_51QA84MG0KgrlY5FBKX5uMqGIPF0QRwCB52FMUeaO4mMIqlaHjWaellTk26kdZYqYgM1USvDyz7jwfoAIL5Wovdpw00AYg8dWct');
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlans = await fetchPlans();
        const activePlans = fetchedPlans.filter((plan: Plan) => plan.isActive);
        setPlans(activePlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchData();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    try {
      setPaymentStatus('processing');
      setPaymentMessage('Processing your payment...');
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const data = await createCheckoutSession(email, selectedPlan);
      if (data) {
        // Simulate payment processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, randomly simulate success/failure
        // In real implementation, this would be handled by Stripe's redirect
        const isSuccess = Math.random() > 0.3; // 70% success rate for demo
        
        if (isSuccess) {
          setPaymentStatus('success');
          setPaymentMessage('Payment successful! Welcome to your new plan.');
        } else {
          setPaymentStatus('failure');
          setPaymentMessage('Payment failed. Please check your payment details and try again.');
        }
        
        // In real implementation, uncomment this line:
        // await stripe.redirectToCheckout({ sessionId: data.session.id });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('failure');
      setPaymentMessage('Payment failed. Please try again.');
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setPaymentMessage('');
  };

  const getCardColors = (planType: string) => {
    const colors = {
      'Basic': 'from-blue-400 to-indigo-500',
      'Premium': 'from-purple-400 to-pink-500',
      'Trial': 'from-green-400 to-emerald-500',
      'default': 'from-gray-400 to-gray-500'
    };
    return colors[planType as keyof typeof colors] || colors.default;
  };

  const formatCount = (count: number | null | undefined) => {
    if (!count) return '0';
    return count > 900 ? 'Unlimited' : `Up to ${count}`;
  };

  const ButtonIcon = ({ isSelected }: { isSelected: boolean }) => (
    <motion.div
      className="flex items-center space-x-1"
      animate={isSelected ? {
        x: [0, 5, 0],
      } : {}}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Zap className="w-5 h-5" />
      <ChevronRight className="w-4 h-4" />
    </motion.div>
  );

  const PaymentStatusOverlay: React.FC = () => (
    <AnimatePresence>
      {paymentStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            {paymentStatus === 'processing' && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-6 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                >
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Processing Payment
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {paymentMessage}
                </p>
                <motion.div
                  className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </motion.div>
              </>
            )}

            {paymentStatus === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 10,
                    delay: 0.2 
                  }}
                  className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Payment Successful!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-600 dark:text-gray-300 mb-6"
                >
                  {paymentMessage}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6"
                >
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>{selectedPlan?.planName}</strong> plan activated
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    ${selectedPlan?.price}/month
                  </p>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetPayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Continue to Dashboard</span>
                </motion.button>
              </>
            )}

            {paymentStatus === 'failure' && (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 10,
                    delay: 0.2 
                  }}
                  className="mx-auto mb-6 w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center"
                >
                  <XCircle className="w-8 h-8 text-red-600" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Payment Failed
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-600 dark:text-gray-300 mb-6"
                >
                  {paymentMessage}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex space-x-3"
                >
                  <button
                    onClick={resetPayment}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      resetPayment();
                      setTimeout(handlePayment, 100);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </motion.button>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black pt-0 pb-32">
      <motion.div 
        className="container mx-auto px-4 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {selectedPlan ? selectedPlan.description : "Select the plan that best fits your business needs"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {plans.map((plan) => (
              <motion.div
                key={plan._id}
                variants={cardVariants}
                whileHover="hover"
                layout
                className={`relative overflow-hidden rounded-2xl ${
                  selectedPlan?._id === plan._id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                <motion.div
                  className={`relative h-full p-8 pb-24 bg-gradient-to-br ${getCardColors(plan.planType)} ${
                    selectedPlan?._id === plan._id ? 'opacity-100' : 'opacity-90'
                  }`}
                  whileHover={{ opacity: 1 }}
                >
                  {selectedPlan?._id === plan._id && (
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <Shield className="w-6 h-6 text-white" />
                    </motion.div>
                  )}

                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-2">{plan.planName}</h2>
                    <div className="text-4xl font-bold mb-6">
                      ${plan.price}
                      <span className="text-lg font-normal opacity-80">/month</span>
                    </div>

                    {/* Updated Resource Limits Section */}
                    <div className="mb-6 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>{formatCount(plan.employeeCount)} employees</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserCog className="w-5 h-5" />
                        <span>{formatCount(plan.managerCount)} managers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5" />
                        <span>{formatCount(plan.projectCount)} projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>{formatCount(plan.serviceRequestCount)} service requests</span>
                      </div>
                    </div>

                    <div className="border-t border-white border-opacity-20 pt-6">
                      <h3 className="text-lg font-semibold mb-4">Features</h3>
                      <ul className="space-y-4">
                        {plan.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center space-x-3"
                          >
                            <Check className="w-5 h-5 text-white flex-shrink-0" />
                            <span className="opacity-90">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPlan(plan)}
                        className="w-full py-4 px-6 rounded-xl bg-white text-gray-900 font-semibold
                                 hover:bg-opacity-90 transition-colors duration-200
                                 flex items-center justify-center space-x-2"
                      >
                        <span>
                          {selectedPlan?._id === plan._id ? 'Selected Plan' : 'Select Plan'}
                        </span>
                        <ButtonIcon isSelected={selectedPlan?._id === plan._id} />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ 
          y: selectedPlan ? 0 : 100,
          opacity: selectedPlan ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg transform"
      >
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Selected Plan</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {selectedPlan?.planName} - ${selectedPlan?.price}/month
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePayment}
              disabled={!selectedPlan || paymentStatus === 'processing'}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl
                         font-semibold disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center space-x-2"
            >
              {paymentStatus === 'processing' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⟳
                </motion.div>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <PaymentStatusOverlay />
    </div>
  );
};

export default PlanSelection;
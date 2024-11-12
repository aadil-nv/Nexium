import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTheme from '../../hooks/useTheme';
import { FaEdit } from 'react-icons/fa';
import { FaRegCheckCircle, FaRegCircle } from 'react-icons/fa';
import ModalForm from './Modal';

interface CardProps {
  planId: string;
  planName: string;
  description: string;
  price: number;
  planType: string;
  durationInMonths: number;
  features: string[];
  isActive: boolean;
  onStatusChange: (newStatus: boolean) => void;
  onPlanUpdate: (updatedPlan: any) => void;
}

const Card: React.FC<CardProps> = ({
  planId,
  planName,
  description,
  price,
  planType,
  durationInMonths,
  features,
  isActive,
  onStatusChange,
  onPlanUpdate
}) => {
  const { themeColor } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'Trial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Premium':
        return 'bg-blue-100 text-blue-800';
      case 'Basic':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const featuresString = features.join(', ');

  return (
    <>
      <motion.div
        className={`relative w-full sm:w-80 p-6 rounded-lg shadow-lg ${getPlanColor(planType)}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold">{planName}</h3>
        <p className="text-sm mt-2">{description}</p>
        <div className="mt-4">
          <span className="font-bold text-lg">
            {price === 0 ? 'Free' : `$${price}`}
          </span>
          <span className="text-gray-500 ml-2">/ {durationInMonths} Month(s)</span>
        </div>
        <ul className="list-disc list-inside text-gray-600 mt-4 text-sm">
          {features.map((feature, index) => (
            <li key={`${feature}-${index}`}>{feature}</li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between items-center">
          <span className={`px-3 py-1 text-sm rounded-full ${getPlanColor(planType)}`}>
            {planType}
          </span>
        </div>

        <button
          onClick={() => setIsModalVisible(true)}
          style={{ backgroundColor: themeColor }}
          className="absolute bottom-4 right-4 flex items-center text-white px-4 py-2 rounded-md shadow-lg"
        >
          <FaEdit className="mr-2" /> Edit Plan
        </button>

        <button
          onClick={() => onStatusChange(!isActive)}
          className={`absolute bottom-4 left-4 flex items-center text-white px-4 py-2 rounded-md shadow-lg ${
            isActive ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isActive ? (
            <>
              <FaRegCheckCircle className="mr-2" /> Online
            </>
          ) : (
            <>
              <FaRegCircle className="mr-2" /> Offline
            </>
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {isModalVisible && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-md"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ModalForm
                onClose={() => setIsModalVisible(false)}
                isVisible={isModalVisible}
                planData={{
                  planName,
                  description,
                  price,
                  planType,
                  durationInMonths,
                  featuresString,
                  planId,
                }}
                themeColor={themeColor}
                onPlanUpdate={onPlanUpdate}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Card;

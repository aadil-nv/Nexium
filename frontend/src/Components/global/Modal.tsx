import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  onClose: () => void;
  isVisible: boolean;
  planData: {
    planName: string;
    description: string;
    price: number;
    planType: string;
    durationInMonths: number;
    featuresString: string;
    planId: string;
  };
  themeColor: string;
  onPlanUpdate: (updatedPlan: any) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, isVisible, planData, themeColor, onPlanUpdate }) => {
  const [formData, setFormData] = useState(planData);

  useEffect(() => {
    setFormData(planData);
  }, [planData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanUpdate(formData);
    onClose();
  };

  const renderInput = (label: string, type: string, name: string, value: any, options?: string[]) => (
    <div>
      <label className="block text-sm font-medium text-black">{label}</label>
      {type === 'select' ? (
        <select name={name} value={value} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black">
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={value} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black" />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
        />
      )}
    </div>
  );

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFeatures = e.target.value;
    setFormData({ ...formData, featuresString: updatedFeatures });
  };

  return (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ${isVisible ? 'block' : 'hidden'}`} onClick={onClose}>
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-black"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center text-black">Update Plan</h2>

          {renderInput('Plan Name', 'text', 'planName', formData.planName)}
          {renderInput('Description', 'textarea', 'description', formData.description)}
          {renderInput('Price', 'number', 'price', formData.price)}
          {renderInput('Plan Type', 'select', 'planType', formData.planType, ['Trial', 'Premium', 'Basic'])}
          {renderInput('Duration (Months)', 'number', 'durationInMonths', formData.durationInMonths)}

          {/* Editable Features */}
          <div>
            <label className="block text-sm font-medium text-black">Features</label>
            <input
              type="text"
              name="featuresString"
              value={formData.featuresString}
              onChange={handleFeaturesChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              placeholder="Enter features separated by commas"
            />
          </div>

          <div className="flex justify-between items-center space-x-4">
            <button type="button" onClick={onClose} className="w-1/2 py-2 bg-gray-300 text-black rounded-md transition-all hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" style={{ backgroundColor: themeColor }} className="w-1/2 py-2 text-white rounded-md transition-all hover:bg-opacity-80">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;

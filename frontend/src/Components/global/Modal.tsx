import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { ICardProps } from '../../interface/GlobalInterface';

interface ModalProps {
  onClose: () => void;
  isVisible: boolean;
  planData: ICardProps;
  themeColor: string;
  onPlanUpdate: (updatedPlan: ICardProps) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, isVisible, planData, themeColor, onPlanUpdate }) => {
  const [formData, setFormData] = useState<ICardProps>(planData);
  const [features, setFeatures] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(planData);
    const featuresArray = planData.featuresString 
    ? planData.featuresString.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0)
    : (planData.features ?? []).map(feature => feature.trim()).filter(feature => feature.length > 0);
  setFeatures(featuresArray);
}, [planData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.planName.trim()) {
      newErrors.planName = 'Plan name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price must be non-negative';
    }

    if (formData.durationInMonths < 1) {
      newErrors.durationInMonths = 'Duration must be at least 1 month';
    }

    if (features.length === 0) {
      newErrors.features = 'At least one feature is required';
    }

    if (features.some(feature => !feature.trim())) {
      newErrors.features = 'Features cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    // Clear features error when user updates
    if (errors.features) {
      setErrors({ ...errors, features: '' });
    }
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedFormData: ICardProps = {
        ...formData,
        featuresString: features.join(','),  // Add featuresString back
        features: features,
        isActive: formData.isActive ?? true,
        onStatusChange: formData.onStatusChange ?? (() => {}),
        onPlanUpdate: formData.onPlanUpdate ?? (() => {})
      };
      onPlanUpdate(updatedFormData);
      onClose();
    }
  };

  const renderInput = (label: string, type: string, name: string, value : string | number, options?: string[]) => (
    <div>
      <label className="block text-sm font-medium text-black">{label}</label>
      {type === 'select' ? (
        <select 
          name={name} 
          value={value} 
          onChange={handleChange} 
          className={`mt-1 block w-full px-4 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
        >
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea 
          name={name} 
          value={value} 
          onChange={handleChange} 
          className={`mt-1 block w-full px-4 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          className={`mt-1 block w-full px-4 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ${isVisible ? 'block' : 'hidden'}`} onClick={onClose}>
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-black hover:text-gray-700"
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

          {/* Features Section */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Features</label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className={`flex-1 px-4 py-2 border ${errors.features ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                    placeholder="Enter feature"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
            {errors.features && (
              <p className="mt-1 text-sm text-red-500">{errors.features}</p>
            )}
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} />
              <span>Add Feature</span>
            </button>
          </div>

          <div className="flex justify-between items-center space-x-4 pt-4">
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
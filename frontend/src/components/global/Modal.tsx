import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { superAdminInstance } from '../../services/superAdminInstance';

interface ICardProps {
  planId: string;
  planName: string;
  description: string;
  price: number;
  planType: 'Trial' | 'Premium' | 'Basic';
  durationInMonths: number;
  features: string[];
  employeeCount?: number | null;
  managerCount?: number | null;
  projectCount?: number | null;
  serviceRequestCount?: number | null;
  featuresString?: string;
  isActive: boolean;
  onStatusChange: (isActive: boolean) => void;
  onPlanUpdate: (updatedPlan: ICardProps) => void;
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(planData);
    const featuresArray = planData.featuresString 
      ? planData.featuresString.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0)
      : (planData.features ?? []);
    setFeatures(featuresArray);
  }, [planData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.planName.trim()) newErrors.planName = 'Plan name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price < 0) newErrors.price = 'Price must be non-negative';
    if (formData.durationInMonths < 1) newErrors.durationInMonths = 'Duration must be at least 1 month';
    if (features.length === 0) newErrors.features = 'At least one feature is required';
    if (features.some(feature => !feature.trim())) newErrors.features = 'Features cannot be empty';
    
    if (formData.employeeCount !== null && formData.employeeCount !== undefined && formData.employeeCount < 0) {
      newErrors.employeeCount = 'Employee count must be non-negative';
    }
    if (formData.managerCount !== null && formData.managerCount !== undefined && formData.managerCount < 0) {
      newErrors.managerCount = 'Manager count must be non-negative';
    }
    if (formData.projectCount !== null && formData.projectCount !== undefined && formData.projectCount < 0) {
      newErrors.projectCount = 'Project count must be non-negative';
    }
    if (formData.serviceRequestCount !== null && formData.serviceRequestCount !== undefined && formData.serviceRequestCount < 0) {
      newErrors.serviceRequestCount = 'Service request count must be non-negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['price', 'durationInMonths', 'employeeCount', 'managerCount', 'projectCount', 'serviceRequestCount'];
    
    const processedValue = numericFields.includes(name) 
      ? value === '' ? null : Number(value)
      : value;

    setFormData({ ...formData, [name]: processedValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    if (errors.features) {
      setErrors({ ...errors, features: '' });
    }
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        const updatedFormData: ICardProps = {
          ...formData,
          features: features,
          featuresString: features.join(','),
        };

        const response = await superAdminInstance.put(
          `/superAdmin-service/api/subscription/update-subscriptiondetiles/${formData.planId}`,
          updatedFormData
        );

        if (response.status === 200) {
          onPlanUpdate(updatedFormData);
          onClose();
        } else {
          setErrors({ 
            submit: 'Failed to update subscription. Please try again.' 
          });
        }
      } catch (error) {
        setErrors({ 
          submit: 'An error occurred while updating the subscription. Please try again.' 
        });
        console.error('Error updating subscription:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ${isVisible ? 'block' : 'hidden'}`} 
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]"
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
          disabled={isSubmitting}
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center text-black">Update Plan</h2>

          {/* Basic Fields */}
          <div>
            <label className="block text-sm font-medium text-black">Plan Name</label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${errors.planName ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
              disabled={isSubmitting}
            />
            {errors.planName && <p className="mt-1 text-sm text-red-500">{errors.planName}</p>}
          </div>

          {/* Count Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">Employee Count</label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount ?? ''}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border ${errors.employeeCount ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                disabled={isSubmitting}
              />
              {errors.employeeCount && <p className="mt-1 text-sm text-red-500">{errors.employeeCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Manager Count</label>
              <input
                type="number"
                name="managerCount"
                value={formData.managerCount ?? ''}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border ${errors.managerCount ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                disabled={isSubmitting}
              />
              {errors.managerCount && <p className="mt-1 text-sm text-red-500">{errors.managerCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Project Count</label>
              <input
                type="number"
                name="projectCount"
                value={formData.projectCount ?? ''}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border ${errors.projectCount ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                disabled={isSubmitting}
              />
              {errors.projectCount && <p className="mt-1 text-sm text-red-500">{errors.projectCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Service Request Count</label>
              <input
                type="number"
                name="serviceRequestCount"
                value={formData.serviceRequestCount ?? ''}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border ${errors.serviceRequestCount ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                disabled={isSubmitting}
              />
              {errors.serviceRequestCount && <p className="mt-1 text-sm text-red-500">{errors.serviceRequestCount}</p>}
            </div>
          </div>

          {/* Other Fields */}
          <div>
            <label className="block text-sm font-medium text-black">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
              disabled={isSubmitting}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
              disabled={isSubmitting}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Plan Type</label>
            <select
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${errors.planType ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
              disabled={isSubmitting}
            >
              <option value="Trial">Trial</option>
              <option value="Premium">Premium</option>
              <option value="Basic">Basic</option>
            </select>
            {errors.planType && <p className="mt-1 text-sm text-red-500">{errors.planType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Duration (Months)</label>
            <input
              type="number"
              name="durationInMonths"
              value={formData.durationInMonths}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${errors.durationInMonths ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
              disabled={isSubmitting}
            />
            {errors.durationInMonths && <p className="mt-1 text-sm text-red-500">{errors.durationInMonths}</p>}
          </div>

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
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              <Plus size={16} />
              <span>Add Feature</span>
            </button>
          </div>

          <div className="flex justify-between items-center space-x-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-1/2 py-2 bg-gray-300 text-black rounded-md transition-all hover:bg-gray-400 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{ backgroundColor: themeColor }} 
              className="w-1/2 py-2 text-white rounded-md transition-all hover:bg-opacity-80 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
         {errors.submit && (
            <p className="mt-2 text-sm text-red-500 text-center">{errors.submit}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { message } from 'antd';
import { businessOwnerInstance } from '../../../services/businessOwnerInstance';
const themeColor = '#4f46e5';

interface LeaveType {
  _id: string;
  sickLeave: number;
  casualLeave: number;
  maternityLeave: number;
  paternityLeave: number;
  paidLeave: number;
  unpaidLeave: number;
  compensatoryLeave: number;
  bereavementLeave: number;
  marriageLeave: number;
  studyLeave: number;
}

interface ApiResponse {
  success: boolean;
  data: LeaveType[];
}

interface FormData {
  [key: string]: number;
}

const BusinessOwnerLeavePolicy: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [initialFormData, setInitialFormData] = useState<FormData>({});
  const [leaveId, setLeaveId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async (): Promise<void> => {
    try {
      const response = await businessOwnerInstance.get<ApiResponse>('/businessOwner-service/api/business-owner/get-all-leavetypes');
      console.log('response.data', response.data);
      
      if (response.data.success && response.data.data.length > 0) {
        const leaveData = response.data.data[0];
        
        if (leaveData) {
          const { _id, ...cleanData } = leaveData;
          setLeaveId(_id);
          setFormData(cleanData);
          setInitialFormData(cleanData);
        }
      } else {
        message.error('No leave types found');
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      message.error(error instanceof Error ? error.message : 'Failed to fetch leave types');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string): void => {
    // Convert to number, cap at 99, and prevent negative values
    const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 99);
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const hasChanges = (): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!hasChanges()) {
      message.warning('No changes detected to save');
      return;
    }

    setSaving(true);
    try {
      await businessOwnerInstance.post(`/businessOwner-service/api/business-owner/update-leavetypes/${leaveId}`, formData);
      setInitialFormData(formData);
      message.success('Leave settings updated successfully!');
    } catch (error) {
      console.error('Error updating leave types:', error);
      message.error(error instanceof Error ? error.message : 'Failed to update leave settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="flex-1 min-w-0"
          >
            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
              Leave Settings
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Configure maximum days allowed for each leave type (0-99 days)
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(formData).map(([name, days], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={days}
                      onChange={(e) => handleInputChange(name, e.target.value)}
                      className="block w-full px-4 py-3 text-black rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-indigo-500 focus:border-indigo-500"
                      style={{ borderColor: themeColor }}
                    />
                    {(days < 0 || days > 99) && (
                      <p className="text-red-500 text-xs mt-1">
                        Must be between 0 and 99 days
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end"
            >
              <button
                type="submit"
                disabled={saving || Object.values(formData).some(val => val < 0 || val > 99)}
                className={`
                  px-6 py-3 rounded-lg text-white font-medium shadow-sm
                  transition-all duration-200
                  ${hasChanges() && !Object.values(formData).some(val => val < 0 || val > 99)
                    ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                    : 'bg-gray-400 cursor-not-allowed'
                  }
                `}
                style={{ backgroundColor: hasChanges() ? themeColor : undefined }}
              >
                {saving ? (
                  <div className="flex items-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-5 h-5 border-2 border-white rounded-full border-t-transparent mr-2"
                    />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </motion.div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default BusinessOwnerLeavePolicy;
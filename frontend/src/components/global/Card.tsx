import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, Skeleton, Button, Badge, Modal } from 'antd';
import useTheme from '../../hooks/useTheme';
import { FaEdit, FaRegCheckCircle, FaRegCircle, FaUsers, FaUserTie, FaProjectDiagram, FaClipboardList } from 'react-icons/fa';
import ModalForm from './Modal';

type PlanType = 'Trial' | 'Premium' | 'Basic';

interface ICardProps {
  planId: string;
  planName: string;
  description: string;
  price: number;
  planType: PlanType;
  durationInMonths: number;
  features: string[];
  employeeCount?: number | null;
  managerCount?: number | null;
  projectCount?: number | null;
  serviceRequestCount?: number | null;
  isActive: boolean;
  onStatusChange: (isActive: boolean) => void;
  onPlanUpdate: (updatedPlan: ICardProps) => void;
  loading?: boolean;
}

const planColors: Record<PlanType, { 
  bg: string; 
  text: string; 
  border: string;
  badge: string;
  gradient: string;
}> = {
  Trial: { 
    bg: '#fffbe6', 
    text: '#d48806', 
    border: '#ffe58f',
    badge: '#ffd666',
    gradient: 'linear-gradient(145deg, #fff7e6 0%, #fff1b8 100%)'
  },
  Premium: { 
    bg: '#e6f4ff', 
    text: '#1677ff', 
    border: '#91caff',
    badge: '#69b1ff',
    gradient: 'linear-gradient(145deg, #e6f4ff 0%, #bae0ff 100%)'
  },
  Basic: { 
    bg: '#f6ffed', 
    text: '#52c41a', 
    border: '#b7eb8f',
    badge: '#95de64',
    gradient: 'linear-gradient(145deg, #f6ffed 0%, #d9f7be 100%)'
  }
};

const Card: React.FC<ICardProps> = ({
  planId, planName, description, price, planType, durationInMonths, features,
  employeeCount, managerCount, projectCount, serviceRequestCount,
  isActive, onStatusChange, onPlanUpdate, loading = false
}) => {
  const { themeColor } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const planColor = planColors[planType] || { 
    bg: '#fafafa', 
    text: '#434343', 
    border: '#d9d9d9',
    badge: '#d9d9d9',
    gradient: 'linear-gradient(145deg, #fafafa 0%, #f0f0f0 100%)'
  };

  const showStatusConfirmation = () => {
    Modal.confirm({
      title: `Change Plan Status`,
      content: `Are you sure you want to change "${planName}" to ${isActive ? 'Offline' : 'Online'}? ${
        isActive 
          ? 'This will hide the plan from users.' 
          : 'This will make the plan visible to users.'
      }`,
      okText: isActive ? 'Set Offline' : 'Set Online',
      cancelText: 'Cancel',
      okButtonProps: {
        style: {
          backgroundColor: isActive ? '#ff4d4f' : '#52c41a',
          borderColor: isActive ? '#ff4d4f' : '#52c41a'
        }
      },
      onOk: async () => {
        setIsUpdating(true);
        try {
          await onStatusChange(!isActive);
        } finally {
          setIsUpdating(false);
        }
      }
    });
  };

  const formatCount = (count: number | null | undefined) => {
    if (!count) return '0';
    return count > 900 ? 'Unlimited' : count.toString();
  };

  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto p-6 rounded-xl shadow-lg">
        <Skeleton.Input active block size="large" className="mb-4" />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Alert
        message={isActive ? "Plan Active" : "Plan Inactive"}
        description={
          isActive 
            ? "This plan is currently available to users" 
            : "This plan is currently hidden from users"
        }
        type={isActive ? "success" : "warning"}
        showIcon
        className="mb-4"
        style={{ borderRadius: '8px' }}
      />

      <motion.div
        className="relative overflow-hidden rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: planColor.gradient,
          border: `1px solid ${planColor.border}`,
        }}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <Badge.Ribbon 
            text={planType} 
            color={planColor.text}
            style={{ 
              marginTop: '8px',
              marginRight: '8px'
            }}
          />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{planName}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          
          {/* Price */}
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
            <span className="ml-2 text-gray-600">
              / {durationInMonths} {durationInMonths === 1 ? 'Month' : 'Months'}
            </span>
          </div>
        </div>

        {/* Resources */}
        <div className="px-6 py-4 bg-white bg-opacity-50">
          <div className="grid grid-cols-2 gap-4">
            {employeeCount !== null && employeeCount !== undefined && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: planColor.bg }}>
                  <FaUsers className="w-4 h-4" style={{ color: planColor.text }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{formatCount(employeeCount)}</div>
                  <div className="text-xs text-gray-600">Employees</div>
                </div>
              </div>
            )}
            {managerCount !== null && managerCount !== undefined && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: planColor.bg }}>
                  <FaUserTie className="w-4 h-4" style={{ color: planColor.text }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{formatCount(managerCount)}</div>
                  <div className="text-xs text-gray-600">Managers</div>
                </div>
              </div>
            )}
            {projectCount !== null && projectCount !== undefined && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: planColor.bg }}>
                  <FaProjectDiagram className="w-4 h-4" style={{ color: planColor.text }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{formatCount(projectCount)}</div>
                  <div className="text-xs text-gray-600">Projects</div>
                </div>
              </div>
            )}
            {serviceRequestCount !== null && serviceRequestCount !== undefined && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: planColor.bg }}>
                  <FaClipboardList className="w-4 h-4" style={{ color: planColor.text }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{formatCount(serviceRequestCount)}</div>
                  <div className="text-xs text-gray-600">Requests</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="px-6 py-4 bg-white">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Features Included</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <FaRegCheckCircle 
                  className="w-4 h-4 mt-0.5 flex-shrink-0" 
                  style={{ color: planColor.text }}
                />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <Button
              type={isActive ? 'primary' : 'default'}
              onClick={showStatusConfirmation}
              loading={isUpdating}
              icon={isActive ? <FaRegCheckCircle /> : <FaRegCircle />}
              style={isActive ? {
                backgroundColor: '#52c41a',
                borderColor: '#52c41a',
                width: '50%'
              } : {
                width: '50%'
              }}
            >
              {isActive ? 'Online' : 'Offline'}
            </Button>

            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
              icon={<FaEdit />}
              style={{ 
                backgroundColor: themeColor,
                width: '50%'
              }}
            >
              Edit Plan
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalVisible && (
          <ModalForm
            onClose={() => setIsModalVisible(false)}
            isVisible={isModalVisible}
            planData={{
              planId,
              planName,
              description,
              price,
              planType,
              durationInMonths,
              features,
              employeeCount,
              managerCount,
              projectCount,
              serviceRequestCount,
              featuresString: features.join(', '),
              isActive,
              onStatusChange,
              onPlanUpdate
            }}
            themeColor={themeColor}
            onPlanUpdate={onPlanUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Card;
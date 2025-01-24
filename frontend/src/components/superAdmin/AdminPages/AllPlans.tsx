import React, { useEffect, useState } from 'react';
import Card from '../../global/Card';
import useTheme from '../../../hooks/useTheme';
import { fetchAllPlans, updatePlanStatus } from '../../../api/superAdminApi';

interface Plan {
  _id: string;
  planName: string;
  description: string;
  price: number;
  planType: string;
  durationInMonths: number;
  features: string[];
  isActive: boolean;
}

const AllPlans: React.FC = () => {
  const { themeMode } = useTheme();
  const [plansData, setPlansData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlansData = async () => {
      try {
        const plans = await fetchAllPlans();
        setPlansData(plans);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        setLoading(false);
      }
    };
    fetchPlansData();
  }, []);

  const handleStatusChange = (planId: string, newStatus: boolean) => {
    setPlansData((prev) => 
      prev.map((plan) => 
        plan._id === planId ? { ...plan, isActive: newStatus } : plan
      )
    );
    updatePlanStatus(planId, newStatus);
  };

  const titleColor = themeMode === 'dark' ? 'text-white' : 'text-gray-900';

  if (loading) return <div className="text-center text-lg">Loading plans...</div>;

  return (
    <div>
      <h2 className={`text-2xl font-extrabold text-start mb-8 ${titleColor}`}>
        Manage and Update Subscription Plans
      </h2>
      <div className="mt-14 flex flex-wrap justify-center gap-4 mr-24">
        {plansData.map((plan) => (
          <Card
            key={plan._id}
            planId={plan._id}
            planName={plan.planName}
            description={plan.description}
            price={plan.price}
            planType={plan.planType}
            durationInMonths={plan.durationInMonths}
            features={plan.features}
            isActive={plan.isActive}
            onStatusChange={(newStatus) => handleStatusChange(plan._id, newStatus)}
            onPlanUpdate={(updatedPlan) => 
              setPlansData((prev) => 
                prev.map((plan) => 
                  plan._id === updatedPlan.planId 
                    ? { ...plan, ...updatedPlan } 
                    : plan
                )
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default AllPlans;
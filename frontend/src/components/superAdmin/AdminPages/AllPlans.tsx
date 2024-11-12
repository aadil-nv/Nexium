import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../global/Card';
import useTheme from '../../../hooks/useTheme';
import { privateApi } from "../../../services/axiosConfig";

const AllPlans: React.FC = () => {
  const { themeColor, themeMode } = useTheme();
  const [plansData, setPlansData] = useState<any[]>([]); // State to store the fetched subscription plans
  const [loading, setLoading] = useState<boolean>(true); // Loading state to handle data fetching

  // Fetch subscription data from the API
  useEffect(() => {
    const fetchPlansData = async () => {
      try {
        const response = await privateApi.get(`/subscription/fetch-all-subscriptions`);
        if (response.data.success) {
          setPlansData(response.data.subscriptions); // Set plans data from the API response
        }
      } catch (error) {
        console.error('Error fetching plans data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlansData();
  }, []);

  // Handle toggling of the plan's active status
  const handleStatusChange = (planId: string, newStatus: boolean) => {
    // Update the status of the plan in the plansData array
    setPlansData((prevPlans) =>
      prevPlans.map((plan) =>
        plan._id === planId ? { ...plan, isActive: newStatus } : plan
      )
    );

    // Optionally, make an API call to persist the status change to the backend
    privateApi
      .patch(`/super-admin/subscription/update-status/${planId}`, { isActive: newStatus })
      .catch((error) => {
        console.error('Error updating plan status:', error);
      });
  };

  // Handle update of plan data after modal submission
  const handlePlanUpdate = (updatedPlan: any) => {
    setPlansData((prevPlans) =>
      prevPlans.map((plan) =>
        plan._id === updatedPlan.planId ? { ...plan, ...updatedPlan } : plan
      )
    );
  };

  const titleColor = themeMode === 'dark' ? 'text-white' : 'text-gray-900';

  if (loading) {
    return <div className="text-center text-lg">Loading plans...</div>; // Show loading message while data is being fetched
  }

  return (
    <div>
      <h2 className={`text-2xl font-extrabold text-start mb-8 ${titleColor}`}>
        Manage and Update Subscription Plans
      </h2>

      <div className="mt-14">
        <div className="flex flex-wrap justify-center gap-4 mr-24">
          {plansData.map((plan) => (
            <Card
              planId={plan._id} // Ensure to use the correct unique key
              key={plan._id}
              planName={plan.planName}
              description={plan.description}
              price={plan.price}
              planType={plan.planType}
              durationInMonths={plan.durationInMonths}
              features={plan.features}
              isActive={plan.isActive} // Pass the current active status of the plan
              onStatusChange={(newStatus: boolean) => handleStatusChange(plan._id, newStatus)} // Pass the status change handler
              onPlanUpdate={handlePlanUpdate} // Pass the update handler for modal
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPlans;

import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store'; // Adjust the path if necessary

const serviceRequestsData = [
  { id: 1, title: "Request for IT Support", date: "2024-10-21", status: "Pending" },
  { id: 2, title: "Maintenance Request", date: "2024-10-20", status: "Completed" },
  { id: 3, title: "New Equipment Request", date: "2024-10-19", status: "In Progress" },
  { id: 4, title: "Software Installation", date: "2024-10-18", status: "Pending" },
  { id: 5, title: "Network Issue", date: "2024-10-17", status: "Resolved" },
];

const ServiceRequests = () => {
  // Get the current color from Redux store
  const currentColor = useSelector((state: RootState) => state.menu.themeColor); 

  return (
    <div className="container mx-auto p-4 bg-gray-200"> {/* Change background color here */}
      <h1 className="text-2xl font-bold mb-4" style={{ color: currentColor }}>Service Requests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceRequestsData.map((request) => (
          <motion.div
            key={request.id}
            className="bg-white shadow-md rounded-lg p-4 transition duration-300 ease-in-out hover:shadow-lg" // Card background color
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold" style={{ color: currentColor }}>{request.title}</h2>
            <p className="text-gray-500">{request.date}</p>
            <p className={`text-sm ${request.status === 'Completed' ? 'text-green-500' : 'text-red-500'}`} style={{ color: currentColor }}>
              Status: {request.status}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceRequests;

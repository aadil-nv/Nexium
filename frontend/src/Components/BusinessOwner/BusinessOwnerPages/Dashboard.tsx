import React from 'react';
import { motion } from 'framer-motion'; // For animations
import { Bar, Line } from 'react-chartjs-2'; // Import charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const userRole = useSelector((state: RootState) => state.businessOwner.role);
  const userAuthenticated = useSelector((state: RootState) => state.businessOwner.isAuthenticated);
  const userToken = useSelector((state: RootState) => state.businessOwner.token);

  // Bar chart data
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: '#4f46e5',
      },
    ],
  };

  // Line chart data
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Active Users',
        data: [50, 100, 200, 150],
        borderColor: '#10b981',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-6 text-center text-indigo-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Dashboard
      </motion.h1>

      {/* Grid layout for responsive design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Sales Bar Chart */}
        <motion.div
          className="p-4 bg-white shadow-lg rounded-lg overflow-hidden w-full h-96"
          whileHover={{ scale: 1.05 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Monthly Sales</h2>
          <div className="w-full h-full">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </motion.div>

        {/* Active Users Line Chart */}
        <motion.div
          className="p-4 bg-white shadow-lg rounded-lg overflow-hidden w-full h-96"
          whileHover={{ scale: 1.05 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Active Users</h2>
          <div className="w-full h-full">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </motion.div>
      </div>

      {/* Demo Details Section */}
      <motion.div
        className="mt-8 p-4 bg-indigo-700 text-white rounded-lg shadow-lg hover:bg-indigo-600 transition-all duration-300 flex flex-col items-center w-full max-w-4xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Demo Details</h2>
        <p className="text-center text-sm md:text-lg">
          This dashboard is fully responsive, featuring animated graphs and hover effects. Optimized for all devices.
        </p>
      </motion.div>

      {/* User Details Section */}
      <div className="mt-8 p-4 bg-indigo-700 text-white rounded-lg shadow-lg hover:bg-indigo-600 transition-all duration-300 w-full max-w-lg flex flex-col items-center">
        <p className="text-lg text-center">Role: {userRole}</p>
        <p className="text-lg text-center">Authenticated: {userAuthenticated.toString()}</p>
        <div className="text-lg text-center w-full overflow-x-auto whitespace-nowrap">
          <p className="inline-block">Token: {userToken}</p>
        </div>
      </div>
    </div>
  );
}

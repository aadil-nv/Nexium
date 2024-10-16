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
    <div className="p-4 min-h-screen bg-gray-100">
      <motion.h1 
        className="text-4xl font-bold mb-6 text-center text-indigo-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Dashboard
      </motion.h1>

      {/* Grid layout for responsive design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Bar Chart */}
        <motion.div
          className="p-6 bg-white shadow-lg rounded-lg"
          whileHover={{ scale: 1.05 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
          <Bar data={barData} options={{ responsive: true }} />
        </motion.div>

        {/* Active Users Line Chart */}
        <motion.div
          className="p-6 bg-white shadow-lg rounded-lg"
          whileHover={{ scale: 1.05 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Active Users</h2>
          <Line data={lineData} options={{ responsive: true }} />
        </motion.div>
      </div>

      {/* Demo Details Section */}
      <motion.div
        className="mt-8 p-6 bg-indigo-700 text-white rounded-lg shadow-lg hover:bg-indigo-600 transition-all duration-300"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Demo Details</h2>
        <p className="text-lg">This dashboard is fully responsive, features animated graphs, and includes hover effects. It's optimized for all devices, making sure it looks great on both desktop and mobile.</p>
      </motion.div>
    </div>
  );
}

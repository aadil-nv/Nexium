import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine } from 'react-icons/fa';
import { Skeleton } from 'antd';
import {AreaChart,Area,CartesianGrid,XAxis,YAxis,Tooltip,Legend, ResponsiveContainer,} from 'recharts';
import { fetchDashboardData } from '../../../api/businessOwnerApi';
import {DashboardData ,StatCardProps ,ChartContainerProps} from "../../../interface/BusinessOwnerInterface"



const StatCard: React.FC<StatCardProps> = ({ icon, title, value, bgColor }) => (
  <motion.div
    className={`p-6 rounded-lg shadow hover:shadow-lg transition-shadow ${bgColor}`}
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="space-y-2 text-white flex items-center">
      <div className="mr-4 text-3xl">{icon}</div>
      <div>
        <p className="text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  </motion.div>
);

const ChartContainer: React.FC<ChartContainerProps> = ({ children }) => (
  <motion.div
    className="bg-white p-4 rounded-lg shadow"
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default function BusinessOwnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 4 }} title={{ width: 300 }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton.Avatar 
              key={item} 
              shape="square" 
              size={200} 
              active 
              style={{ width: '100%', height: '150px' }} 
            />
          ))}
        </div>
        <Skeleton 
          active 
          title={false} 
          paragraph={{ rows: 10, width: '100%' }} 
          className="mt-6"
        />
      </div>
    );
  }

  // Ensure data exists before destructuring
  if (!data || !data.businessOwners) {
    return <div>No data available</div>;
  }

  const { businessOwners } = data;

  const chartData = Object.keys(businessOwners.employeeMonthCounts).map((month) => ({
    month,
    employees: businessOwners.employeeMonthCounts[month],
    managers: businessOwners.managerMonthCounts[month],
  }));

  return (
    <motion.div
      className="mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        Analytics Dashboard
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<FaUsers />}
          title="Total Employees"
          value={businessOwners.totalEmployees}
          bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
        />
        <StatCard
          icon={<FaUsers />}
          title="Active Employees"
          value={businessOwners.activeEmployees}
          bgColor="bg-gradient-to-r from-green-400 to-green-600"
        />
        <StatCard
          icon={<FaUsers />}
          title="Total Managers"
          value={businessOwners.totalManagers}
          bgColor="bg-gradient-to-r from-yellow-400 to-yellow-600"
        />
        <StatCard
          icon={<FaUsers />}
          title="Active Managers"
          value={businessOwners.activeManagers}
          bgColor="bg-gradient-to-r from-red-400 to-red-600"
        />
      </div>

      {/* Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ChartContainer>
          <motion.h2
            className="text-xl font-bold mb-4 flex items-center text-black"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaChartLine className="mr-2" /> Employee & Manager Trends
          </motion.h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorManagers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="employees"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorEmployees)"
                />
                <Area
                  type="monotone"
                  dataKey="managers"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorManagers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </motion.div>
  );
}
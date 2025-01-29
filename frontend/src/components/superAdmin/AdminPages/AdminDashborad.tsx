import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaDollarSign, FaShoppingCart, FaUsers, FaChartLine } from 'react-icons/fa';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { superAdminInstance } from '../../../services/superAdminInstance';

interface DashboardData {
  subTotalRevenue: number;
  totalBusinessOwners: number;
  thisMonthBusinessOwners: number;
  lastMonthBusinessOwners: number;
  planCountsAndRevenue: { planName: string; count: number; totalRevenue: number }[];
}

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  change: number;
  textColor: string;
  bgColor: string;
}

interface ChartContainerProps {
  children: ReactNode;
}

const StatCard = ({ icon, title, value, change, textColor, bgColor }: StatCardProps) => (
  <motion.div className={`p-6 rounded-lg shadow hover:shadow-lg transition-shadow ${bgColor}`} whileHover={{ scale: 1.05 }}>
    <div className="space-y-2 text-white flex items-center">
      <div className="mr-4 text-3xl">{icon}</div>
      <div>
        <p className="text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className={`text-sm ${textColor}`}>{change > 0 ? '↑' : '↓'} {Math.abs(change)}%</p>
      </div>
    </div>
  </motion.div>
);

const ChartContainer = ({ children }: ChartContainerProps) => (
  <motion.div className="bg-white p-4 rounded-lg shadow" whileHover={{ scale: 1.02 }}>
    {children}
  </motion.div>
);

export default function RechartsDemo() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    superAdminInstance.get('/superAdmin-service/api/dashboard/dashboard-data')
      .then(response => setDashboardData(response.data))
      .catch(error => console.error('Error fetching dashboard data:', error));
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <motion.div className="mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <motion.h1 className="text-3xl font-bold mb-8" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
        Analytics Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<FaDollarSign />}
          title="Total Revenue"
          value={`$${dashboardData.subTotalRevenue || 'N/A'}`}
          change={0}
          textColor="text-green-200"
          bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
        />
        <StatCard
          icon={<FaShoppingCart />}
          title="Total Sales"
          value={dashboardData.totalBusinessOwners}
          change={0}
          textColor="text-green-200"
          bgColor="bg-gradient-to-r from-green-400 to-green-600"
        />
        <StatCard
          icon={<FaUsers />}
          title="Active Customers"
          value={dashboardData.thisMonthBusinessOwners}
          change={dashboardData.thisMonthBusinessOwners - dashboardData.lastMonthBusinessOwners}
          textColor="text-green-200"
          bgColor="bg-gradient-to-r from-yellow-400 to-yellow-600"
        />
        <StatCard
          icon={<FaChartLine />}
          title="Conversion Rate"
          value={`${((dashboardData.thisMonthBusinessOwners / dashboardData.totalBusinessOwners) * 100).toFixed(2)}%`}
          change={0}
          textColor="text-green-200"
          bgColor="bg-gradient-to-r from-red-400 to-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ChartContainer>
          <motion.h2 className="text-xl font-bold mb-4 flex items-center text-black" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <FaChartLine className="mr-2" /> Plan Revenue Analysis
          </motion.h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.planCountsAndRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="planName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="#8884d8" />
                <Area type="monotone" dataKey="totalRevenue" stroke="#82ca9d" fillOpacity={1} fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </motion.div>
  );
}
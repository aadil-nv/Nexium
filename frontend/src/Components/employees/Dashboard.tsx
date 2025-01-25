import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendar, 
  FaUserTimes,  
  FaCheckCircle,
  FaTasks,
  FaExclamationCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { employeeInstance } from '../../services/employeeInstance';
import { Spin } from 'antd';

interface TaskStats {
  completed: number;
  inProgress: number;
  backlog: number;
  blocked: number;
  codeReview: number;
  qaTesting: number;
  deployed: number;
  approved: number;
}

interface DashboardData {
  employeeId: string;
  absentDays: number;
  presentDays: number;
  totalHoursWorked: string;
  approvedLeaves: number;
  perDayWorkedMinutes: Array<{
    date: string;
    workedMinutes: number;
  }>;
  dashboardData: {
    employee: {
      name: string;
      profilePicture: string;
    };
    monthlyTaskData: Array<{
      month: string;
      completed: number;
      inProgress: number;
      backlog: number;
      blocked: number;
      total: number;
    }>;
    currentTaskStats: TaskStats;
    taskPriorities?: {
      high: number;
      medium: number;
      low: number;
    };
    totalTasks: number;
    totalCompletedTasks: number;
    lastUpdated: string;
  };
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await employeeInstance.get('/employee-service/api/dashboard/get-all-dashboard-data');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center p-6">
        <h3 className="text-xl font-bold text-red-500">Failed to load dashboard data.</h3>
      </div>
    );
  }

  const StatCard = ({ icon, title, value, bgColor }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    bgColor: string;
  }) => (
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

  const ChartContainer = ({ children, title, icon }: {
    children: React.ReactNode;
    title: string;
    icon: React.ReactNode;
  }) => (
    <motion.div
      className="bg-white p-6 rounded-lg shadow"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-xl font-bold mb-4 flex items-center text-black"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
        <span className="ml-2">{title}</span>
      </motion.h2>
      {children}
    </motion.div>
  );

  // Colors for task priority pie chart
  const PRIORITY_COLORS = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  // Safe access to task priorities with default values
  const priorityData = [
    { 
      name: 'High', 
      value: dashboardData.dashboardData.taskPriorities?.high ?? 0 
    },
    { 
      name: 'Medium', 
      value: dashboardData.dashboardData.taskPriorities?.medium ?? 0 
    },
    { 
      name: 'Low', 
      value: dashboardData.dashboardData.taskPriorities?.low ?? 0 
    }
  ];

  const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    return months[now.getMonth()];
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div>
        <h1 className=''>Employee Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<FaCalendar />}
          title="Days Present"
          value={dashboardData.presentDays}
          bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
        />
        <StatCard
          icon={<FaUserTimes />}
          title={`Absent Days (${getCurrentMonth()})`}
          value={dashboardData.absentDays}
          bgColor="bg-gradient-to-r from-red-400 to-red-600"
        />
        <StatCard
          icon={<FaCheckCircle />}
          title="Completed Tasks"
          value={dashboardData.dashboardData.totalCompletedTasks}
          bgColor="bg-gradient-to-r from-green-400 to-green-600"
        />
        <StatCard
          icon={<FaTasks />}
          title="Total Tasks"
          value={dashboardData.dashboardData.totalTasks}
          bgColor="bg-gradient-to-r from-purple-400 to-purple-600"
        />
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Task Status" icon={<FaTasks />}>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Active Tasks</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {dashboardData.dashboardData.currentTaskStats.inProgress}
              </h3>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Completed</p>
              <h3 className="text-2xl font-bold text-green-600">
                {dashboardData.dashboardData.currentTaskStats.completed}
              </h3>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">In Review</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {dashboardData.dashboardData.currentTaskStats.codeReview}
              </h3>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Blocked</p>
              <h3 className="text-2xl font-bold text-red-600">
                {dashboardData.dashboardData.currentTaskStats.blocked}
              </h3>
            </div>
          </div>
        </ChartContainer>

        <ChartContainer title="Task Priorities" icon={<FaExclamationCircle />}>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PRIORITY_COLORS[entry.name.toLowerCase() as keyof typeof PRIORITY_COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Monthly Task Trend */}
      <div className="grid grid-cols-1 gap-6">
        <ChartContainer title="Monthly Task Progress" icon={<FaHourglassHalf />}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.dashboardData.monthlyTaskData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed Tasks"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
                <Area
                  type="monotone"
                  dataKey="inProgress"
                  name="In Progress"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorInProgress)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </motion.div>
  );
}
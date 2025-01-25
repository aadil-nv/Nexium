import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine } from 'react-icons/fa';
import { Skeleton } from 'antd';
import {AreaChart,Area,CartesianGrid,XAxis,YAxis,Tooltip,Legend,ResponsiveContainer,} from 'recharts';
import { managerInstance } from '../../../services/managerInstance';

// Detailed type definitions
interface TaskData {
  month?: string;
  department?: string;
  completedTasks: number;
}

interface ManagerData {
  employeeCount: number;
  departmentCount: number;
  taskCount: number;
  completedTaskCount: number;
  areaChartData: {
    departmentTaskData: TaskData[];
    tasksOverTimeData: TaskData[];
  };
}

interface ApiResponse {
  manager: ManagerData;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  bgColor: string;
}

export default function ManagerDashboard() {
  const [data, setData] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    managerInstance
      .get<ApiResponse>('/manager-service/api/dashboard/dashboard-data')
      .then((response) => {
        setData(response.data.manager);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, []);

  // Stat card component
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

  // Chart container component
  const ChartContainer: React.FC<{children: React.ReactNode}> = ({ children }) => (
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

  // Loading state with Ant Design Skeleton
  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 4 }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton.Node key={item} active>
              <div className="w-full h-full" />
            </Skeleton.Node>
          ))}
        </div>
        <div className="mt-6">
          <Skeleton.Node active style={{ width: '100%', height: '300px' }}>
            <div className="w-full h-full" />
          </Skeleton.Node>
        </div>
      </div>
    );
  }

  // Ensure data is available before rendering
  if (!data) {
    return null;
  }

  const { 
    employeeCount, 
    departmentCount, 
    taskCount, 
    completedTaskCount, 
    areaChartData 
  } = data;
  const { departmentTaskData, tasksOverTimeData } = areaChartData;

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
          value={employeeCount}
          bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
        />
        <StatCard
          icon={<FaUsers />}
          title="Total Departments"
          value={departmentCount}
          bgColor="bg-gradient-to-r from-green-400 to-green-600"
        />
        <StatCard
          icon={<FaUsers />}
          title="Total Tasks"
          value={taskCount}
          bgColor="bg-gradient-to-r from-yellow-400 to-yellow-600"
        />
        <StatCard
          icon={<FaUsers />}
          title="Completed Tasks"
          value={completedTaskCount}
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
            <FaChartLine className="mr-2" /> Task Completion Over Time
          </motion.h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tasksOverTimeData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="completedTasks"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorTasks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Department Task Data */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
        <ChartContainer>
          <motion.h2
            className="text-xl font-bold mb-4 flex items-center text-black"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaChartLine className="mr-2" /> Completed Tasks by Department
          </motion.h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={departmentTaskData}>
                <defs>
                  <linearGradient id="colorDepartmentTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="completedTasks"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorDepartmentTasks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </motion.div>
  );
}
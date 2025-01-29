import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendar, 
  FaUserTimes, 
  FaProjectDiagram,
  FaHourglassHalf,
  FaCheckCircle,
  FaPause
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

interface Project {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignedEmployee: string;
}

interface MonthlyProject {
  month: string;
  completedCount: number;
}

interface DashboardData {
  employeeId: string;
  totalNetSalary: string;
  absentDays: number;
  presentDays: number;
  totalHoursWorked: string;
  approvedLeaves: number;
  perDayWorkedMinutes: Array<{
    date: string;
    workedMinutes: number;
  }>;
  dashboardData: {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    onHoldProjects: number;
    monthWiseCompletedProjects: MonthlyProject[];
    recentProjects: Project[];
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

  // Project status data for pie chart
  const projectStatusData = [
    { name: 'Completed', value: dashboardData.dashboardData.completedProjects },
    { name: 'In Progress', value: dashboardData.dashboardData.inProgressProjects },
    { name: 'On Hold', value: dashboardData.dashboardData.onHoldProjects }
  ];

  const PROJECT_STATUS_COLORS = {
    Completed: '#10b981',
    'In Progress': '#3b82f6',
    'On Hold': '#f59e0b'
  };

  // Transform monthly data for area chart
  const monthlyData = dashboardData.dashboardData.monthWiseCompletedProjects.map(item => ({
    month: item.month,
    completed: item.completedCount
  }));

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div>
        <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
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
          title="Days Absent"
          value={dashboardData.absentDays}
          bgColor="bg-gradient-to-r from-red-400 to-red-600"
        />
        <StatCard
          icon={<FaProjectDiagram />}
          title="Total Projects"
          value={dashboardData.dashboardData.totalProjects}
          bgColor="bg-gradient-to-r from-purple-400 to-purple-600"
        />
        <StatCard
          icon={<FaCheckCircle />}
          title="Completed Projects"
          value={dashboardData.dashboardData.completedProjects}
          bgColor="bg-gradient-to-r from-green-400 to-green-600"
        />
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Project Status" icon={<FaProjectDiagram />}>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">In Progress</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {dashboardData.dashboardData.inProgressProjects}
              </h3>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Completed</p>
              <h3 className="text-2xl font-bold text-green-600">
                {dashboardData.dashboardData.completedProjects}
              </h3>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">On Hold</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {dashboardData.dashboardData.onHoldProjects}
              </h3>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <h3 className="text-2xl font-bold text-purple-600">
                {dashboardData.dashboardData.totalProjects}
              </h3>
            </div>
          </div>
        </ChartContainer>

        <ChartContainer title="Project Distribution" icon={<FaPause />}>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PROJECT_STATUS_COLORS[entry.name as keyof typeof PROJECT_STATUS_COLORS]} 
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

      {/* Monthly Project Trend */}
      <div className="grid grid-cols-1 gap-6">
        <ChartContainer title="Monthly Completed Projects" icon={<FaHourglassHalf />}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  name="Completed Projects"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Recent Projects */}
      <div className="mt-6">
        <ChartContainer title="Recent Projects" icon={<FaProjectDiagram />}>
          <div className="grid gap-4">
            {dashboardData.dashboardData.recentProjects.map((project, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <h3 className="font-bold text-lg">{project.projectName}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">
                    Start: {new Date(project.startDate).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    End: {new Date(project.endDate).toLocaleDateString()}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>
    </motion.div>
  );
}
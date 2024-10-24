import React from 'react';
import { useSelector } from 'react-redux';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Table } from 'antd';
import { motion } from 'framer-motion';
import 'chart.js/auto';

const BusinessOwnerAdminDashboard: React.FC = () => {
  const themeMode = useSelector((state: { menu: { themeMode: 'light' | 'dark' } }) => state.menu.themeMode);
  const themeColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);
  
  // Sample data for the Ant Design table
  const dataSource = [
    { key: '1', name: 'Employee Count', value: 50 },
    { key: '2', name: 'Profit', value: '$20,000' },
    { key: '3', name: 'Orders', value: 300 },
    { key: '4', name: 'New Users', value: 120 },
  ];

  const columns = [
    {
      title: 'Metric',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  // Data for charts
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: themeColor,
        borderColor: themeColor,
        data: [3000, 2500, 3200, 4000, 3600, 5000, 4500],
      },
    ],
  };

  const pieData = {
    labels: ['Product A', 'Product B', 'Product C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [themeColor, '#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div className={`p-4 ${themeMode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Small Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {dataSource.map(item => (
          <motion.div
            key={item.key}
            className="p-4 bg-gray-100 rounded-lg shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold mb-2">{item.name}</h2>
            <p className="text-xl">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-4  rounded-lg shadow" >
          <h2 className="font-semibold mb-2">Revenue Bar Chart</h2>
          <Bar data={chartData} />
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Monthly Revenue Line Chart</h2>
          <Line data={chartData} />
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Product Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Ant Design Table */}
      <h2 className="font-semibold mb-2" >Overview</h2>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default BusinessOwnerAdminDashboard;

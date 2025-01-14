import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Col, Row, Typography, Divider, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarOutlined, UserOutlined, CheckCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import {employeeInstance} from '../../services/employeeInstance'; // Ensure this is correctly imported

export default function Dashboard() {
  const { themeColor, themeMode } = useTheme();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Fetching dashboard data....................................................');
      
      try {
        const response = await employeeInstance.get('/employee/api/dashboard/get-all-dashboard-data');
        console.log('response.data---------------------------------------------------', response.data);
        
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography.Title level={3} style={{ color: themeColor }}>
          Failed to load dashboard data.
        </Typography.Title>
      </div>
    );
  }

  const statistics = [
    { id: 1, title: 'Days Worked', value: dashboardData.presentDays, icon: <CalendarOutlined /> },
    { id: 2, title: 'Absences', value: dashboardData.absentDays, icon: <UserOutlined /> },
    { id: 3, title: 'Projects', value: 2 , icon: <CheckCircleOutlined /> },
    { id: 4, title: 'Leaves Left', "value": "10", icon: <BarChartOutlined /> },
  ];

  const lineChartData = dashboardData.perDayWorkedMinutes.map((entry: { date: string; workedMinutes: number }) => ({
    day: entry.date,
    hours: entry.workedMinutes / 60, // Convert minutes to hours for display
  }));

  return (
    <div style={{ padding: '10px', minHeight: '80vh' }}>
      {/* Animated Title */}
      <motion.h1
        className="text-3xl font-semibold mb-6 border-l-4 pl-4"
        style={{ borderColor: themeColor }}
      >
        Dashboard Overview
      </motion.h1>

      {/* Statistics Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '34px' }}>
        {statistics.map((stat) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            key={stat.id}
            style={{ width: '275px' }}
          >
            <Card
              title={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {stat.icon}
                  <span style={{ marginLeft: '8px' }}>{stat.title}</span>
                </span>
              }
              bordered={false}
              style={{
                boxShadow: `0 4px 15px rgba(0,0,0,0.1)`,
                borderRadius: '10px',
                height: '200px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `2px solid ${themeColor}`,
              }}
            >
              <Typography.Title level={3} style={{ fontWeight: 'bold', color: themeColor }}>
                {stat.value}
              </Typography.Title>
            </Card>
          </motion.div>
        ))}
      </div>

      <Divider />

      {/* Animated Line Graph */}
      <Row justify="center" style={{ marginTop: '30px' }}>
        <Col span={24}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              title="Work Hours for the Week"
              bordered={false}
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke={themeColor} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Divider />
    </div>
  );
}

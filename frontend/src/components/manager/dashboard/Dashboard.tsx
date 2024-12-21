import React from 'react';
import { motion } from 'framer-motion';
import { Card, Col, Row, Typography, Divider } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarOutlined, UserOutlined, CheckCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import useTheme from '../../../hooks/useTheme';

const lineChartData = [
  { day: 'Mon', hours: 8 },
  { day: 'Tue', hours: 7 },
  { day: 'Wed', hours: 9 },
  { day: 'Thu', hours: 8 },
  { day: 'Fri', hours: 7 },
  { day: 'Sat', hours: 6 },
  { day: 'Sun', hours: 5 },
];

const statistics = [
  { id: 1, title: 'Days Worked', value: 220, icon: <CalendarOutlined /> },
  { id: 2, title: 'Absences', value: 5, icon: <UserOutlined /> },
  { id: 3, title: 'Minutes Worked Today', value: 480, icon: <CheckCircleOutlined /> },
  { id: 4, title: 'Leaves Left', value: 10, icon: <BarChartOutlined /> },
];

export default function Dashboard() {

  const {themeColor, themeMode, isActiveMenu} = useTheme();
  
  return (
    <div style={{ padding: '10px', minHeight: '80vh' }}>
      {/* Animated Title */}
        <motion.h1
              className="text-3xl font-semibold mb-6 border-l-4 pl-4" style={{ borderColor: themeColor }}
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
            style={{ width: '275px' }} // Adjust card width as needed
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
                border: `2px solid ${themeColor}`,  // Apply themeColor to border
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
            <Card title="Work Hours for the Week" bordered={false} style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke={themeColor} animationDuration={1500} />  {/* Apply themeColor to Line stroke */}
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

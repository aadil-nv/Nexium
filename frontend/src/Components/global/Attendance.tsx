import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Input } from 'antd';
import AttendanceCard from './AttendanceCard';
import useTheme from '../../hooks/useTheme';

export interface AttendanceEntry {
  id: number;
  date: string;
  status: 'Pending' | 'Present' | 'Absent' | 'Leave';
}

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [leaveReason, setLeaveReason] = useState<string>('');
  const { isActiveMenu } = useTheme();

  useEffect(() => {
    const generateAttendanceData = () => {
      const monthData: AttendanceEntry[] = [];
      const today = new Date();
      const formattedToday = today.toLocaleDateString('en-CA');
      const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (let i = 1; i <= numDays; i++) {
        const date = new Date(currentYear, currentMonth, i).toLocaleDateString('en-CA');
        const status = date === formattedToday || new Date(date) > today ? 'Pending' : getRandomStatus();
        monthData.push({ id: i, date, status });
      }

      setCurrentDate(formattedToday);
      setAttendanceData(monthData);
    };

    generateAttendanceData();
  }, [currentMonth, currentYear]);

  const getRandomStatus = (): 'Present' | 'Absent' | 'Leave' | 'Pending' => {
    const statuses: ('Present' | 'Absent' | 'Leave' | 'Pending')[] = ['Present', 'Absent', 'Leave', 'Pending'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getCardColor = (status: string) => {
    const colors: Record<string, string> = {
      Present: '#4caf50',
      Absent: '#f44336',
      Leave: '#ff9800',
      Pending: '#9e9e9e',
    };
    return colors[status] || '#9e9e9e';
  };

  const isCurrentDate = (date: string) => date === currentDate;

  const handleOpenLeaveModal = (date: string) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleCloseLeaveModal = () => {
    setIsModalVisible(false);
    setLeaveReason('');
  };

  const handleSubmitLeave = () => {
    setAttendanceData(prevData =>
      prevData.map(entry =>
        entry.date === selectedDate ? { ...entry, status: 'Leave' } : entry
      )
    );
    handleCloseLeaveModal();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-center text-red-800 mb-4">Attendance Calendar</h1>

      <Row gutter={[16, 16]} style={{ paddingLeft: isActiveMenu ? '20px' : '0', transition: 'padding-left 0.3s' }}>
        {attendanceData.map(entry => (
          <Col xs={8} sm={6} md={4} lg={3} key={entry.id}>
            <AttendanceCard
              entry={entry}
              handleOpenLeaveModal={handleOpenLeaveModal}
              isCurrentDate={isCurrentDate}
              getCardColor={getCardColor}
            />
          </Col>
        ))}
      </Row>

      <Modal
        title="Apply for Leave"
        visible={isModalVisible}
        onCancel={handleCloseLeaveModal}
        onOk={handleSubmitLeave}
      >
        <Input
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
          placeholder="Reason for leave"
        />
      </Modal>
    </div>
  );
};

export default Attendance;

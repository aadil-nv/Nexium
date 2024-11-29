import React from 'react';
import { Card } from 'antd';
import { AttendanceEntry } from './Attendance'; // Import the interface from Attendance
import useTheme from '../../hooks/useTheme';

interface AttendanceCardProps {
  entry: AttendanceEntry;
  handleOpenLeaveModal: (date: string) => void;
  isCurrentDate: (date: string) => boolean;
  getCardColor: (status: string) => string;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  entry,
  handleOpenLeaveModal,
  isCurrentDate,
  getCardColor,
}) => {
  const { isActiveMenu } = useTheme();

  const handleCardClick = () => {
    if (entry.status === 'Leave') {
      handleOpenLeaveModal(entry.date);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      title={
        <span style={{ fontWeight: isCurrentDate(entry.date) ? 'bold' : 'normal' }}>
          {new Date(entry.date).getDate()}
        </span>
      }
      bordered={false}
      style={{
        backgroundColor: getCardColor(entry.status),
        color: '#fff',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        height: '100px', // Reduced height for better responsiveness
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: entry.status === 'Leave' ? 'pointer' : 'default',
        transition: 'all 0.3s',
      }}
    >
      <div className="text-lg">{entry.status}</div>
    </Card>
  );
};

export default AttendanceCard;

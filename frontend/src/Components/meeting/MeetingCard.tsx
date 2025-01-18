// components/MeetingCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Space, Avatar, Tag, Button, Popconfirm, Typography, Tooltip } from 'antd';
import { VideoCameraOutlined, CalendarOutlined, TeamOutlined, UserOutlined, EditOutlined, DeleteOutlined, CopyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { Meeting } from '../../interface/meetingInterface';

const { Text } = Typography;

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (meetingId: string) => void;
  onCopyLink: (link: string) => void;
  onJoinMeeting: (link: string) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onEdit,
  onDelete,
  onCopyLink,
  onJoinMeeting,
}) => {
  const [timeUntilMeeting, setTimeUntilMeeting] = useState<string>('');
  const [canJoin, setCanJoin] = useState(false);

  const getRandomColor = () => {
    const colors = ['blue', 'green', 'cyan', 'purple', 'magenta'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const updateMeetingStatus = () => {
    const meetingTime = dayjs(meeting.meetingTime);
    const now = dayjs();
    const diffMinutes = meetingTime.diff(now, 'minute');
    
    // Allow joining 5 minutes before and up to 30 minutes after meeting start
    setCanJoin(diffMinutes >= -30 && diffMinutes <= 120);

    if (diffMinutes > 0) {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      setTimeUntilMeeting(
        hours > 0 
          ? `Starts in ${hours}h ${minutes}m`
          : `Starts in ${minutes}m`
      );
    } else if (diffMinutes >= -30) {
      setTimeUntilMeeting('Meeting in progress');
    } else {
      setTimeUntilMeeting('Meeting ended');
    }
  };

  useEffect(() => {
    updateMeetingStatus();
    const timer = setInterval(updateMeetingStatus, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [meeting.meetingTime]);

  // Render participant avatars in a grid
  const renderParticipants = () => {
    const maxDisplay = 4;
    const remaining = meeting.participants.length - maxDisplay;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {meeting.participants.slice(0, maxDisplay).map((participant, index) => (
          <Tooltip key={participant.userId} title={participant.userName}>
            <Avatar
              src={participant.profilePicture}
              icon={!participant.profilePicture && <UserOutlined />}
              className="border-2 border-white"
              style={{
                marginLeft: index > 0 ? '-8px' : '0',
                zIndex: maxDisplay - index,
              }}
            />
          </Tooltip>
        ))}
        {remaining > 0 && (
          <Tooltip title={`${remaining} more participants`}>
            <Avatar
              className="border-2 border-white bg-gray-200"
              style={{ marginLeft: '-8px' }}
            >
              +{remaining}
            </Avatar>
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card
        className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        actions={[
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(meeting)}
          />,
          <Popconfirm
            key="delete"
            title="Delete meeting?"
            onConfirm={() => onDelete(meeting._id)}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>,
          <Button
            key="copy"
            type="text"
            icon={<CopyOutlined />}
            onClick={() => onCopyLink(meeting.meetingLink)}
          />,
        ]}
        extra={
          <Tag color={getRandomColor()}>
            {dayjs(meeting.meetingTime).format("hh:mm A")}
          </Tag>
        }
      >
        <Space direction="vertical" className="w-full">
          <Space>
            <Avatar
              icon={<VideoCameraOutlined />}
              className="bg-indigo-600"
            />
            <div>
              <Text strong>{meeting.meetingTitle}</Text>
              <div className="text-gray-500 flex items-center gap-2">
                <CalendarOutlined /> {dayjs(meeting.meetingTime).format("YYYY-MM-DD")}
              </div>
            </div>
          </Space>

          <div className="mt-3">
            <div className="text-gray-500 flex items-center gap-2">
              <TeamOutlined /> Participants
              {renderParticipants()}
            </div>
            <div className="text-gray-500 flex items-center gap-2 mt-2">
              <UserOutlined />
              <Space>
                Scheduled by:
                <Avatar 
                  src={meeting.scheduledBy.profilePicture} 
                  icon={!meeting.scheduledBy.profilePicture && <UserOutlined />}
                  size="small"
                /> 
                {meeting.scheduledBy.userName}
              </Space>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 text-gray-500">
            <ClockCircleOutlined />
            <Text>{timeUntilMeeting}</Text>
          </div>

          <Button
            type="primary"
            icon={<VideoCameraOutlined />}
            className={`w-full mt-3 ${
              canJoin 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
            }`}
            onClick={() => canJoin && onJoinMeeting(meeting.meetingLink)}
            disabled={!canJoin}
          >
            {canJoin ? 'Join Now' : 'Not Available'}
          </Button>
        </Space>
      </Card>
    </motion.div>
  );
};
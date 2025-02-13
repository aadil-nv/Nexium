import React, { useState, useEffect } from 'react';
import { Card, Space, Avatar, Tag, Button, Popconfirm, Typography, Tooltip } from 'antd';
import { VideoCameraOutlined, CalendarOutlined, TeamOutlined, UserOutlined, EditOutlined, DeleteOutlined, CopyOutlined, ClockCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Meeting } from '../../interface/meetingInterface';

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (meetingId: string) => void;
  onCopyLink: (link: string) => void;
  onJoinMeeting: (link: string) => void;
}

const { Text } = Typography;

export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onEdit,
  onDelete,
  onCopyLink,
  onJoinMeeting,
}) => {
  console.log("Meeting =================>", meeting);
  
  const [timeUntilMeeting, setTimeUntilMeeting] = useState<string>('');
  const [canJoin, setCanJoin] = useState<boolean>(false);

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const checkMeetingAvailability = (): boolean => {
    const now = new Date();
    const meetingDateTime = new Date(meeting.meetingTime);

    if (meeting.isRecurring) {
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const meetingTimeToday = new Date(now);
      meetingTimeToday.setHours(meetingDateTime.getHours(), meetingDateTime.getMinutes(), 0);
      
      if (meeting.recurringType === 'daily') {
        const diffMinutes = (now.getTime() - meetingTimeToday.getTime()) / (1000 * 60);
        return diffMinutes >= -30 && diffMinutes <= 120;
      } else if (meeting.recurringType === 'weekly' && meeting.recurringDay === currentDay) {
        const diffMinutes = (now.getTime() - meetingTimeToday.getTime()) / (1000 * 60);
        return diffMinutes >= -30 && diffMinutes <= 120;
      }
      return false;
    }

    const diffMinutes = (meetingDateTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes >= -30 && diffMinutes <= 120;
  };

  const updateMeetingStatus = () => {
    const now = new Date();
    const meetingDateTime = new Date(meeting.meetingTime);
    
    setCanJoin(checkMeetingAvailability());

    if (meeting.isRecurring) {
      if (meeting.recurringType === 'daily') {
        setTimeUntilMeeting(`Daily at ${formatTime(meeting.meetingTime)}`);
      } else if (meeting.recurringType === 'weekly' && meeting.recurringDay) {
        setTimeUntilMeeting(`Weekly on ${meeting.recurringDay}s at ${formatTime(meeting.meetingTime)}`);
      }
    } else {
      const diffMinutes = Math.floor((meetingDateTime.getTime() - now.getTime()) / (1000 * 60));
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
    }
  };

  useEffect(() => {
    updateMeetingStatus();
    const timer = setInterval(updateMeetingStatus, 60000);
    return () => clearInterval(timer);
  }, [meeting]);

  const getRandomColor = () => {
    const colors = ['blue', 'green', 'cyan', 'purple', 'magenta'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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

  const getCardActions = (): React.ReactNode[] => {
    return [
      <Tooltip key="edit" title="Edit Meeting">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(meeting)}
        />
      </Tooltip>,
      <Tooltip key="delete" title="Delete Meeting">
        <Popconfirm
          title="Are you sure you want to delete this meeting?"
          onConfirm={() => onDelete(meeting._id)}
        >
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Tooltip>,
      <Tooltip key="copy" title="Copy Meeting Link">
        <Button
          type="text"
          icon={<CopyOutlined />}
          onClick={() => onCopyLink(meeting.meetingLink)}
        />
      </Tooltip>
    ];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card
        className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        actions={getCardActions()}
        extra={
          <Space>
            {meeting.isRecurring && (
              <Tag color="purple" icon={<RedoOutlined />}>
                {meeting.recurringType === 'daily' ? 'Daily' : 'Weekly'}
              </Tag>
            )}
            <Tag color={getRandomColor()}>
              {formatTime(meeting.meetingTime)}
            </Tag>
          </Space>
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
                <CalendarOutlined /> {formatDate(meeting.meetingDate)}
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

export default MeetingCard;
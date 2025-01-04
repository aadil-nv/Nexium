import React from 'react';
import { List, Badge, Avatar, Button, Space, Typography } from 'antd';
import { Employee } from '../../interface/ChatInterface';
import { UsergroupAddOutlined, ClockCircleOutlined, CheckOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';

const { Title } = Typography;

interface ChatPeoplesProps {
  employees: Employee[];
  setSelectedUser: (user: Employee) => void;
  isMobile: boolean;
  formatLastSeen: (date: Date) => string;
  setSiderVisible: (visible: boolean) => void;
}

const ChatPeoples: React.FC<ChatPeoplesProps> = ({
  employees,
  setSelectedUser,
  isMobile,
  formatLastSeen,
  setSiderVisible,
}) => {
  const { themeColor } = useTheme(); // Correctly use the custom useTheme hook

  return (
    <div style={{ padding: '16px', backgroundColor: 'white', maxHeight: '80vh', overflowY: 'auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={3}>People</Title>
      </Space>

      <List
        dataSource={employees}
        renderItem={(emp) => (
          <List.Item
            onClick={() => setSelectedUser(emp)}
            style={{ cursor: 'pointer', padding: '12px 24px', backgroundColor: '#fafafa' }}
          >
            <List.Item.Meta
              avatar={
                <Badge dot status={emp.status  ? 'success' : 'default'} offset={[-4, 32]}>
                  <Avatar src={emp.receiverProfilePicture} size={40} />
                </Badge>
              }
              title={<span style={{ color: '#333' }}>{emp.receiverName}</span>}
              description={
                <Space>
                  {emp.status ? (
                    <>
                      <CheckOutlined style={{ color: 'green' }} /> Active now
                    </>
                  ) : (
                    <>
                      <ClockCircleOutlined style={{ color: '#888' }} /> Last seen {formatLastSeen(emp.lastSeen)}
                    </>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
        style={{backgroundColor: themeColor ,color: 'white' ,borderRadius: '10px'}}
          icon={<UsergroupAddOutlined />}
          block
        >
          Create Group
        </Button>
      </Space>
    </div>
  );
};

export default ChatPeoples;

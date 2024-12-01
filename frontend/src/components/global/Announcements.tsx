import React, { useState } from 'react';
import { RichTextEditor } from '@mantine/rte';
import { Button, Card, List, Space, Select, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function Announcements() {
  const [announcement, setAnnouncement] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [announcementsList, setAnnouncementsList] = useState<
    { id: number; owner: string; content: string; timestamp: string; status: 'success' | 'failure' }[]
  >([]);

  const businessOwners = ['Owner 1', 'Owner 2', 'Owner 3', 'Owner 4'];

  const handleCreateAnnouncement = () => {
    if (announcement.trim() && selectedOwner) {
      const newAnnouncement = {
        id: announcementsList.length + 1,
        owner: selectedOwner,
        content: announcement,
        timestamp: new Date().toLocaleString(),
        status: Math.random() > 0.3 ? 'success' : 'failure', // TypeScript will infer this as 'success' | 'failure'
      } as const; // Using `as const` to ensure type inference for status
      setAnnouncementsList([newAnnouncement, ...announcementsList]);
      setAnnouncement('');
      setSelectedOwner('');
    }
  };
  
  

  const handleClearAnnouncements = () => {
    setAnnouncementsList([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Create New Announcement" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            placeholder="Select Business Owner"
            value={selectedOwner}
            onChange={(value) => setSelectedOwner(value)}
            style={{ width: '100%' }}
          >
            {businessOwners.map((owner) => (
              <Option key={owner} value={owner}>
                {owner}
              </Option>
            ))}
          </Select>
          <RichTextEditor
            value={announcement}
            onChange={setAnnouncement}
          />
          <Button type="primary" onClick={handleCreateAnnouncement} disabled={!selectedOwner || !announcement.trim()}>
            Add Announcement
          </Button>
        </Space>
      </Card>

      <Card
        title="Incoming Announcements"
        extra={
          <Button danger onClick={handleClearAnnouncements}>
            Clear All
          </Button>
        }
      >
        {announcementsList.length ? (
          <List
            dataSource={announcementsList}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Divider>Session {item.id}</Divider>
                  <p>
                    <strong>Business Owner:</strong> {item.owner}
                  </p>
                  <p>
                    <strong>Time:</strong> {item.timestamp}
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  <p>
                    <strong>Status:</strong>{' '}
                    {item.status === 'success' ? (
                      <span style={{ color: 'green' }}>
                        <CheckCircleOutlined /> Sent Successfully
                      </span>
                    ) : (
                      <span style={{ color: 'red' }}>
                        <CloseCircleOutlined /> Failed to Send
                      </span>
                    )}
                  </p>
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <p>No announcements to display.</p>
        )}
      </Card>
    </div>
  );
}

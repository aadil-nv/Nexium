import React, { useState } from 'react';
import { Button, List, Space, Card, Modal, Input, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

type Query = {
  id: number;
  customerName: string;
  inquiry: string;
  status: 'pending' | 'completed';
};

export default function CustomerSupport() {
  const [queries, setQueries] = useState<Query[]>([
    { id: 1, customerName: 'John Doe', inquiry: 'Issue with product delivery', status: 'pending' },
    { id: 2, customerName: 'Jane Smith', inquiry: 'Payment not processed', status: 'pending' },
    { id: 3, customerName: 'Mark Lee', inquiry: 'Incorrect billing details', status: 'pending' },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apologyMessage, setApologyMessage] = useState('');

  // Handle sending an apology letter
  const handleSendApology = (queryId: number) => {
    // Logic to send the apology (for example, saving it to a database)
    setIsModalVisible(false);
    message.success('Apology sent successfully');
  };

  // Mark the query as completed
  const handleMarkAsCompleted = (queryId: number) => {
    setQueries((prevQueries) =>
      prevQueries.map((query) =>
        query.id === queryId ? { ...query, status: 'completed' } : query
      )
    );
    message.success('Query marked as completed');
  };

  // Show apology modal
  const showApologyModal = () => {
    setIsModalVisible(true);
  };

  // Close apology modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Customer Support Queries" style={{ marginBottom: '20px' }}>
        <List
          dataSource={queries}
          renderItem={(query) => (
            <List.Item key={query.id}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <p><strong>Customer:</strong> {query.customerName}</p>
                <p><strong>Inquiry:</strong> {query.inquiry}</p>
                <p><strong>Status:</strong> {query.status === 'pending' ? 'Pending' : 'Completed'}</p>
                <Space>
                  {query.status === 'pending' && (
                    <Button
                      type="primary"
                      onClick={showApologyModal}
                    >
                      Send Apology Letter
                    </Button>
                  )}
                  <Button
                    type="default"
                    onClick={() => handleMarkAsCompleted(query.id)}
                    disabled={query.status === 'completed'}
                  >
                    Mark as Completed
                  </Button>
                </Space>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {/* Modal for apology letter */}
      <Modal
        title="Send Apology Letter"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => handleSendApology(1)} // Change the queryId if needed
            disabled={!apologyMessage.trim()}
          >
            Send Apology
          </Button>,
        ]}
      >
        <Input.TextArea
          rows={4}
          placeholder="Write your apology message here..."
          value={apologyMessage}
          onChange={(e) => setApologyMessage(e.target.value)}
        />
      </Modal>
    </div>
  );
}

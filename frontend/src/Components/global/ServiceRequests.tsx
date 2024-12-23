import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Table, Modal, Spin } from 'antd';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';

export default function ServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    setLoading(true);
    try {
      const response = await businessOwnerInstance.get('/businessOwner/api/business-owner/service-requests');
      setServiceRequests(response.data.data); // Assuming the response contains the data field
    } catch (error) {
      message.error('Failed to fetch service requests.');
    } finally {
      setLoading(false);
    }
  };

  // Handling the service request submission
  const handleRequestService = async (values: any) => {
    setLoading(true);
    try {
      const { serviceName, description } = values;
      await businessOwnerInstance.post('/businessOwner/api/business-owner/add-service-request', {
        serviceName,
        requestReason: description, // Mapping 'description' as 'requestReason'
      });
      message.success('Service request submitted successfully!');
      fetchServiceRequests(); // Refresh the service requests list
    } catch (error) {
      message.error('Failed to request service.');
    } finally {
      setLoading(false);
    }
  };

  // Handling the update of a service request
  const handleUpdateRequest = async (values: any) => {
    if (!currentRequest) return;
    setLoading(true);
    try {
      const { serviceName, description } = values;
      await businessOwnerInstance.post(
        `/businessOwner/api/business-owner/updated-service-request/${currentRequest._id}`,
        {
          serviceName,
          requestReason: description, // Mapping 'description' as 'requestReason'
        }
      );
      message.success('Service request updated successfully!');
      fetchServiceRequests(); // Refresh the service requests list
      setIsModalVisible(false); // Close modal
    } catch (error) {
      message.error('Failed to update service request.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: '_id', // Corrected the ID field from 'id' to '_id'
      key: '_id',
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Request Reason',
      dataIndex: 'requestReason', // Corrected from 'description' to 'requestReason'
      key: 'requestReason',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(), // Format created date
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Button type="primary" onClick={() => handleEditRequest(record)} icon={<i className="fas fa-edit"></i>}>
          Edit
        </Button>
      ),
    },
  ];

  // Set current request and show the modal
  const handleEditRequest = (record: any) => {
    setCurrentRequest(record);
    setIsModalVisible(true);
  };

  return (
    <div>
      <h1>Service Requests</h1>
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          onFinish={handleRequestService}
          style={{ marginBottom: '30px' }}
        >
          <Form.Item
            label="Service Name"
            name="serviceName"
            rules={[
              { required: true, message: 'Please enter service name' },
              { max: 100, message: 'Service name cannot exceed 100 characters' }
            ]} >
            <Input placeholder="Enter service name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please enter description' },
              { min: 10, message: 'Description should be at least 10 characters' },
              { max: 500, message: 'Description cannot exceed 500 characters' }
            ]} >
            <Input.TextArea placeholder="Enter service description" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Request Service
          </Button>
        </Form>

        <Table
          columns={columns}
          dataSource={serviceRequests}
          rowKey="_id" // Corrected rowKey to '_id' field
          pagination={{
            pageSize: 5, // Set the number of items per page
          }}
        />

        <Modal
          title="Edit Service Request"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            layout="vertical"
            initialValues={{
              serviceName: currentRequest?.serviceName,
              description: currentRequest?.requestReason,
            }}
            onFinish={handleUpdateRequest}
          >
            <Form.Item
              label="Service Name"
              name="serviceName"
              rules={[
                { required: true, message: 'Please enter service name' },
                { max: 100, message: 'Service name cannot exceed 100 characters' }
              ]} >
              <Input placeholder="Enter service name" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: 'Please enter description' },
                { min: 10, message: 'Description should be at least 10 characters' },
                { max: 500, message: 'Description cannot exceed 500 characters' }
              ]} >
              <Input.TextArea placeholder="Enter service description" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading}>
              Update Request
            </Button>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
}

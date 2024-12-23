import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Table, Select, Spin, message } from 'antd';
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { superAdminInstance } from '../../../services/superAdminInstance';

// Define interface for service request
interface ServiceRequest {
  _id: string;
  businessOwnerId: string;
  companyName: string;
  companyLogo: string;
  serviceName: string;
  requestReason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerCare() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        const response = await superAdminInstance.get('/superAdmin/api/superadmin/all-serevice-request');
        // Access the nested serviceRequests array from the response
        const requests = response.data.serviceRequests.serviceRequests;
        setServiceRequests(requests);
      } catch (error) {
        message.error('Failed to fetch service requests');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  const handleUpdateStatus = async (newStatus: string, id: string) => {
    setLoading(true);
    try {
      // Optimistically update the UI
      const updatedRequests = serviceRequests.map((request) => {
        if (request._id === id) {
          return { ...request, status: newStatus };
        }
        return request;
      });
      setServiceRequests(updatedRequests);

      // Send the patch request to the server
      await superAdminInstance.patch(`/superAdmin/api/superadmin/update-status/${id}`, { status: newStatus });

      message.success('Service request status updated successfully!');
    } catch (error) {
      message.error('Failed to update status');
      // Rollback the UI update in case of error
      const rollbackRequests = serviceRequests.map((request) => {
        if (request._id === id) {
          return { ...request, status: 'Pending' }; // Or restore to original status if necessary
        }
        return request;
      });
      setServiceRequests(rollbackRequests);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'green';
      case 'In Progress':
        return 'orange';
      case 'Pending':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircleOutlined style={{ color: 'green' }} />;
      case 'In Progress':
        return <SyncOutlined spin style={{ color: 'orange' }} />;
      case 'Pending':
        return <CloseCircleOutlined style={{ color: 'red' }} />;
      default:
        return <CheckCircleOutlined style={{ color: 'gray' }} />;
    }
  };

  const columns = [
    {
      title: 'Company Logo',
      dataIndex: 'companyLogo',
      key: 'companyLogo',
      render: (logo: string) => <img src={logo} alt="Company Logo" width={30} height={30} />
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Request ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Request Reason',
      dataIndex: 'requestReason',
      key: 'requestReason',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: ServiceRequest) => (
        <>
          {getStatusIcon(record.status)}
          <span style={{ marginLeft: 8, color: getStatusColor(record.status) }}>
            {record.status}
          </span>
          <Select
            defaultValue={record.status}
            style={{ width: 150, marginLeft: 8 }}
            onChange={(value) => handleUpdateStatus(value, record._id)}
          >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Resolved">Resolved</Select.Option>
          </Select>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl text-red-800">Customer Care</h1>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={serviceRequests}
          rowKey="_id"
          pagination={false}
          components={{
            body: {
              row: ({ children, ...restProps }: any) => (
                <motion.tr
                  {...restProps}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {children}
                </motion.tr>
              ),
            },
          }}
        />
      </Spin>
    </div>
  );
}

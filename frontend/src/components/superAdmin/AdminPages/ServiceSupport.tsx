import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Table, Select, Spin, message, Input, Space, Modal, Button } from 'antd';
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { superAdminInstance } from '../../../services/superAdminInstance';
import type { TablePaginationConfig } from 'antd/es/table';

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

interface ViewDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  serviceName: string;
  requestReason: string;
}

interface TableRowProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ visible, onClose, serviceName, requestReason }) => (
  <Modal
    title="Request Details"
    open={visible}
    onCancel={onClose}
    footer={[
      <Button key="close" type="primary" onClick={onClose}>
        Close
      </Button>
    ]}
  >
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">Service Name:</h3>
        <Input value={serviceName} readOnly className="bg-gray-50" />
      </div>
      <div>
        <h3 className="text-base font-medium mb-2">Request Reason:</h3>
        <Input.TextArea value={requestReason} readOnly className="bg-gray-50" rows={4} />
      </div>
    </div>
  </Modal>
);

export default function CustomerCare() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchServiceRequests = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await superAdminInstance.get('/superAdmin-service/api/superadmin/all-serevice-request');
      const requests = response.data.serviceRequests.serviceRequests;
      
      let filteredData = [...requests];
      
      if (searchText) {
        filteredData = filteredData.filter(request => 
          request.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
          request.serviceName.toLowerCase().includes(searchText.toLowerCase()) ||
          request._id.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      if (statusFilter) {
        filteredData = filteredData.filter(request => 
          request.status === statusFilter
        );
      }

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setServiceRequests(paginatedData);
      setPagination({
        ...pagination,
        current: page,
        total: filteredData.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to fetch service requests');
      } else {
        message.error('Failed to fetch service requests');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests(pagination.current, pagination.pageSize);
  }, [searchText, statusFilter]);

  const handleUpdateStatus = async (newStatus: string, id: string) => {
    setLoading(true);
    try {
      const updatedRequests = serviceRequests.map((request) => {
        if (request._id === id) {
          return { ...request, status: newStatus };
        }
        return request;
      });
      setServiceRequests(updatedRequests);

      await superAdminInstance.patch(`/superAdmin-service/api/superadmin/update-status/${id}`, { status: newStatus });
      message.success('Service request status updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to update status');
      } else {
        message.error('Failed to update status');
      }
  
      const rollbackRequests = serviceRequests.map((request) =>
        request._id === id ? { ...request, status: 'Pending' } : request
      );
      setServiceRequests(rollbackRequests);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record: ServiceRequest) => {
    setSelectedRequest(record);
    setModalVisible(true);
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
      render: (companyLogo: string) => <img src={companyLogo || "https://cdn.pixabay.com/photo/2012/04/23/15/57/copyright-38672_640.png"} alt="Company Logo" width={30} height={30} />
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      filterable: true,
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
      width: 300,
      render: (text: string, record: ServiceRequest) => (
        <div className="flex items-center justify-between">
          <div className="truncate max-w-[180px]">
            {text}
          </div>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetails(record)}
            className="ml-2 flex-shrink-0"
          >
            View
          </Button>
        </div>
      ),
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
           <span style={{display: 'none' }}>{text}</span>
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

  // Removed unused parameters to fix ESLint warnings
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchServiceRequests(
      newPagination.current || 1,
      newPagination.pageSize || 10
    );
  };

  const CustomTableRow: React.FC<TableRowProps> = ({ children, ...restProps }) => (
    <motion.tr
      {...restProps}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.tr>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl text-red-800 mb-4">Customer Care</h1>
      
      <Space className="mb-4" size="middle">
        <Input
          placeholder="Search by company, service, or ID"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          allowClear
          onChange={setStatusFilter}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="In Progress">In Progress</Select.Option>
          <Select.Option value="Resolved">Resolved</Select.Option>
        </Select>
      </Space>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={serviceRequests}
          rowKey="_id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
          components={{
            body: {
              row: CustomTableRow
            },
          }}
        />
      </Spin>

      {selectedRequest && (
        <ViewDetailsModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedRequest(null);
          }}
          serviceName={selectedRequest.serviceName}
          requestReason={selectedRequest.requestReason}
        />
      )}
    </div>
  );
}
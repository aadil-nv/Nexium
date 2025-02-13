import { useState, useEffect } from 'react';
import { Card, Input, Select, Pagination, Button, Tag, Avatar, Modal, Empty, Skeleton, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserOutlined, 
  BlockOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ExclamationCircleOutlined, 
  PlusOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import type { Employee } from './EmployeeTypes';
import AddEmployeeModal from './NewEmployeeModal';
import EmployeeInfoModal from './EmployeeInfoModal';
import { businessOwnerInstance } from "../../../services/businessOwnerInstance";
import { AxiosError } from 'axios';

const EmployeesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<Employee['professionalDetails']['position'] | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, contextHolder] = Modal.useModal();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const pageSize = 8;

  const positions: Array<Employee['professionalDetails']['position']> = [
    "Team Lead", 
    "Senior Software Engineer", 
    "Junior Software Engineer"
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await businessOwnerInstance.get("/businessOwner-service/api/employee/get-all-employees");
        setEmployees(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch employees data. Please try again later.');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.personalDetails.employeeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPosition = !selectedPosition || 
      employee.professionalDetails.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleBlock = async (employeeId: string) => {
    try {
      const response = await businessOwnerInstance.patch(
        `/businessOwner-service/api/employee/block-employee/${employeeId}`
      );

      if (response.status === 200) {
        setEmployees(prev => prev.map(emp => 
          emp._id === employeeId ? { ...emp, isBlocked: !emp.isBlocked } : emp
        ));
        message.success('Employee status updated successfully');
      } else {
        throw new Error('Failed to update employee status');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to update employee status';
      
      Modal.error({
        title: 'Error',
        content: errorMessage,
      });
      console.error('Error blocking/unblocking employee:', error);
    }
  };

  const handleRemove = async (employeeId: string) => {
    try {
      const response = await businessOwnerInstance.patch(
        `/businessOwner-service/api/employee/remove-employee/${employeeId}`
      );

      if (response.status === 200) {
        setEmployees(prev => prev.filter(emp => emp._id !== employeeId));
        message.success('Employee removed successfully');
      } else {
        throw new Error('Failed to remove employee');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to remove employee';
      
      Modal.error({
        title: 'Error',
        content: errorMessage,
      });
      console.error('Error removing employee:', error);
    }
  };

  const showBlockConfirm = (employee: Employee) => {
    const action = employee.isBlocked ? 'unblock' : 'block';
    modal.confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Employee`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${action} ${employee.personalDetails.employeeName}?`,
      okText: 'Yes',
      okType: employee.isBlocked ? 'primary' : 'danger',
      cancelText: 'No',
      onOk() {
        handleBlock(employee._id);
      },
    });
  };

  const showRemoveConfirm = (employee: Employee) => {
    modal.confirm({
      title: 'Remove Employee',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to remove ${employee.personalDetails.employeeName}? This action cannot be undone.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleRemove(employee._id);
      },
    });
  };

  const handleAddEmployee = (employee: Employee) => {
    setEmployees(prev => [...prev, employee]);
    setIsAddModalVisible(false);
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => 
      emp._id === updatedEmployee._id ? updatedEmployee : emp
    ));
  };

  const LoadingSkeleton = () => (
    <Card className="h-full">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <Skeleton.Avatar active size={64} />
        <div className="text-center w-full">
          <Skeleton.Input active size="small" className="mb-2" />
          <Skeleton.Input active size="small" className="mb-2" />
          <Skeleton.Input active size="small" className="mb-2" />
          <Skeleton paragraph={{ rows: 1 }} className="mb-3" />
          <div className="flex flex-wrap justify-center gap-2">
            <Skeleton.Button active size="small" />
            <Skeleton.Button active size="small" />
            <Skeleton.Button active size="small" />
          </div>
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
          <Empty
            description={error}
            image={Empty.PRESENTED_IMAGE_DEFAULT}
          />
        </div>
      );
    }

    if (!employees.length) {
      return (
        <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
          <Empty
            description="No employees found"
            image={Empty.PRESENTED_IMAGE_DEFAULT}
          />
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {paginatedEmployees.map(employee => (
              <motion.div
                key={employee._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <Avatar
                      size={64}
                      src={employee.personalDetails.profilePicture}
                      icon={!employee.personalDetails.profilePicture && <UserOutlined />}
                    />
                    <div className="text-center w-full">
                      <h3 className="text-base sm:text-lg font-semibold mb-1">
                        {employee.personalDetails.employeeName}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm mb-2">
                        {employee.personalDetails.email}
                      </p>
                      <p className="text-xs sm:text-sm mb-2">
                        {employee.professionalDetails.position}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-3">
                        Joined: {new Date(employee.professionalDetails.joiningDate).toLocaleDateString()}
                      </p>
                      <div className="flex justify-center mb-3 sm:mb-4">
                        <Tag color={employee.isActive ? 'green' : 'red'}>
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </Tag>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button
                          size="middle"
                          type="default"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsViewModalVisible(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="middle"
                          type={employee.isBlocked ? 'primary' : 'default'}
                          icon={<BlockOutlined />}
                          onClick={() => showBlockConfirm(employee)}
                        >
                          {employee.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                        <Button
                          size="middle"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => showRemoveConfirm(employee)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 sm:mt-6 flex justify-center">
          <Pagination
            className="text-sm sm:text-base"
            current={currentPage}
            total={filteredEmployees.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
            responsive
          />
        </div>
      </>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {contextHolder}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Employees List</h1>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
        >
          Add Employee
        </Button>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Input
          placeholder="Search employees..."
          prefix={<SearchOutlined />}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <Select
          placeholder="Filter by position"
          allowClear
          onChange={value => setSelectedPosition(value)}
          className="w-full sm:min-w-[200px] sm:w-auto"
        >
          {positions.map(position => (
            <Select.Option key={position} value={position}>
              {position}
            </Select.Option>
          ))}
        </Select>
      </div>

      {renderContent()}

      <AddEmployeeModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddEmployee}
      />

      <EmployeeInfoModal
        isVisible={isViewModalVisible}
        onClose={() => setIsViewModalVisible(false)}
        employee={selectedEmployee}
        onUpdate={handleEmployeeUpdate}
      />
    </div>
  );
};

export default EmployeesList;
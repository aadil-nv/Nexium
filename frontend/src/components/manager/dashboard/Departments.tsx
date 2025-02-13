import { useState, useEffect, useMemo } from 'react';
import { MdAddBusiness } from 'react-icons/md';
import { Modal, Input, Pagination } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import DepartmentCard from '../../global/DepartmentCard';
import useTheme from '../../../hooks/useTheme';
import AddDepartmentModal from '../../ui/AddDepartment';
import { fetchDepartmentsAPI, removeDepartmentAPI } from '../../../api/managerApi';
import { IDepartment } from '../../../interface/managerInterface';

const { confirm } = Modal;
const ITEMS_PER_PAGE = 6;

export default function Departments() {
  const { themeColor } = useTheme();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDepartmentsAPI().then(setDepartments).catch(console.error);
  }, []);

  // Filter departments based on search query
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) =>
      dept.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.employees.some((emp) => 
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [departments, searchQuery]);

  // Calculate pagination
  const totalItems = filteredDepartments.length;
  const currentDepartments = filteredDepartments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddNewDepartment = (newDepartment: IDepartment) =>
    setDepartments((prev) => [newDepartment, ...prev]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showDeleteConfirm = (departmentId: string, departmentName: string) => {
    confirm({
      title: 'Are you sure you want to delete this department?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div className="py-2">
          <p>Department: {departmentName}</p>
          <p className="text-red-500 mt-2">This action cannot be undone.</p>
        </div>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      width: window.innerWidth < 768 ? '90%' : 420,
      centered: true,
      okButtonProps: {
        className: 'bg-red-500',
      },
      onOk: async () => {
        try {
          await removeDepartmentAPI(departmentId);
          fetchDepartmentsAPI().then(setDepartments).catch(console.error);
          Modal.success({
            content: 'Department removed successfully',
            centered: true,
            width: window.innerWidth < 768 ? '90%' : 420,
          });
        } catch (error) {
          Modal.error({
            title: 'Error',
            content: 'Failed to remove department. Please try again.',
            centered: true,
            width: window.innerWidth < 768 ? '90%' : 420,
          });
          console.error('Error removing department:', error);
        }
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center">
          <Input
            placeholder="Search departments or employees..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={handleSearch}
            value={searchQuery}
            className="w-full sm:w-64"
            allowClear
          />
          <button
            style={{ backgroundColor: themeColor }}
            className="hover:opacity-90 text-white font-semibold py-2 px-4 rounded flex items-center justify-center space-x-2"
            onClick={() => setIsModalVisible(true)}
          >
            <MdAddBusiness className="text-xl" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {filteredDepartments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No departments found matching your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
            {currentDepartments.map(({ departmentId, departmentName, employees }) => (
              <DepartmentCard
                key={departmentId}
                departmentName={departmentName}
                employees={employees.map(({ employeeId, name, position, profilePicture, email, isActive }) => ({
                  employeeId: employeeId,
                  name: name || '',
                  position: position || '',
                  profilePicture: profilePicture || "",
                  email: email || '',
                  isOnline: isActive ?? false,
                }))}
                themeColor={themeColor}
                departmentId={departmentId}
                onEditEmployee={(employeeId) => console.log('Edit employee', employeeId)}
                onRemoveEmployee={(employeeId) =>
                  setDepartments((prev) =>
                    prev.map((dept) =>
                      dept.departmentId === departmentId
                        ? { ...dept, employees: dept.employees.filter((emp) => emp.employeeId !== employeeId) }
                        : dept
                    )
                  )
                }
                onRemoveDepartment={() => showDeleteConfirm(departmentId, departmentName)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={ITEMS_PER_PAGE}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper={false}
              className="responsive-pagination"
            />
          </div>
        </>
      )}

      <AddDepartmentModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddDepartment={handleAddNewDepartment}
      />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ManagerCard from '../../global/ManagerCard';
import useTheme from '../../../hooks/useTheme';
import { Skeleton, Empty } from 'antd';
import AddManagerModal from '../../ui/AddManagerModal';
import { FaPlus } from 'react-icons/fa';
import { fetchManagers } from '../../../api/businessOwnerApi';
import { Manager } from '../../../interface/BusinessOwnerInterface';

export default function EmployeeList() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { themeColor } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Show 8 cards per page (2x4 grid)

  useEffect(() => {
    const loadManagers = async () => {
      setLoading(true);
      try {
        const managersData = await fetchManagers();
        setManagers(managersData);
      } catch (error) {
        console.error('Error fetching managers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadManagers();
  }, []);

  const filteredManagers = managers.filter(manager =>
    (manager.personalDetails.managerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) &&
    (roleFilter === 'All' || manager.role === roleFilter)
  );

  // Calculate pagination values
  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentManagers = filteredManagers.slice(startIndex, endIndex);

  const handleManagerAdded = async () => {
    setLoading(true);
    try {
      const managersData = await fetchManagers();
      setManagers(managersData);
    } catch (error) {
      console.error('Error fetching managers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const PaginationButton = ({ page, isActive }: { page: number, isActive: boolean }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-1 rounded-md mx-1 ${
        isActive 
          ? 'text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      style={{ backgroundColor: isActive ? themeColor : 'transparent' }}
    >
      {page}
    </button>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h1 className="text-2xl font-semibold text-center sm:text-left w-full sm:w-auto">Managers List</h1>
        <motion.button
          onClick={() => setIsModalVisible(true)}
          style={{ backgroundColor: themeColor }}
          className="flex items-center text-white px-4 py-2 rounded-md transition duration-300"
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-2" />Manager
        </motion.button>
      </div>

      <motion.input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full sm:w-72 p-2 border border-gray-300 rounded-md mb-6"
      />

      <div className="mb-6 flex gap-2">
        {['All', 'Manager', 'Admin', 'Employee'].map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-md ${roleFilter === role ? 'bg-gray-300' : 'bg-blue-500'} text-white`}
            style={{ backgroundColor: roleFilter === role ? '#ccc' : themeColor }}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex justify-center">
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </div>
          ))
        ) : currentManagers.length === 0 ? (
          <div className="col-span-full flex justify-center items-center">
            <Empty description="No employees found" />
          </div>
        ) : (
          currentManagers.map((manager, index) => (
            <motion.div 
              key={manager._id} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: index * 0.1, duration: 0.5 }} 
              className="flex justify-center"
            >
              <ManagerCard
                image={manager.personalDetails.profilePicture || ""}
                name={manager.personalDetails.managerName}
                email={manager.personalDetails.email}
                onViewDetails={() => alert(`Viewing details for ${manager.personalDetails.managerName}`)}
                onToggleStatus={() => alert(`Blocking/Unblocking ${manager.personalDetails.managerName}`)}
                isActive={manager.isActive}
                isBlocked={manager.isBlocked}
                isVerified={manager.isVerified}
                managerId={manager._id}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && filteredManagers.length > 0 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationButton 
              key={page} 
              page={page} 
              isActive={currentPage === page} 
            />
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <AddManagerModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onManagerAdded={handleManagerAdded}
      />
    </div>
  );
}
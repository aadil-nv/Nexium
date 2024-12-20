import React, { useState, useEffect } from 'react';
import { Input, List, Skeleton, Empty, Button } from 'antd';
import { motion } from 'framer-motion';
import useTheme from '../../hooks/useTheme';
import { employeeInstance } from '../../services/employeeInstance';

interface Employee {
  id: number;
  name: string;
  position: string;
  isActive: boolean;
  profilePicture?: string;
}

interface Department {
  departmentName?: string;
  employees: Employee[];
}

const Team: React.FC = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { themeColor, isActiveMenu } = useTheme();
  const [department, setDepartment] = useState<Department | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await employeeInstance.get(
          '/employee/api/department/get-mydepartment'
        );
        setDepartment(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching department:', error);
        setLoading(false);
      }
    };

    fetchDepartment();
  }, []);
  console.log("department===============", department);
  

  const filteredEmployees =
    department?.employees?.filter((employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    console.log("filteredEmployees===============", filteredEmployees);
    

  return (
    <div
      className="p-4 transition-all duration-300"
      style={{
        color: themeColor,
        marginLeft: isActiveMenu ? '20px' : '0',
      }}
    >
      {/* Department Name Section */}
      <div
        className="mb-6 p-4 text-white rounded-md"
        style={{ fontSize: '20px', fontWeight: 'bold' , backgroundColor: themeColor }}
      >
        Department: {department?.departmentName || "Your Not added in a Department"}
      </div>

      {/* Search Section */}
      <Input
        placeholder="Search team members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {/* Employee List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <Skeleton active />
        ) : filteredEmployees.length === 0 ? (
          <Empty description="No team members found" />
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={filteredEmployees}
            renderItem={(employee) => (
              <List.Item>
                {/* Inline Team Card with New Style */}
                <motion.div
                  className="p-8 rounded-xl shadow-lg hover:scale-105 transform transition duration-500 ease-in-out"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    backgroundColor: themeColor, // Set the themeColor as the background for the card
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Online/Offline Status Circle */}
                    <div
  className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white`}
  style={{
    backgroundColor: employee.isActive 
      ? "#28a745" // A proper green color
      : "#dc3545", // A proper red color
  }}
></div>


                    <img
                      src={employee.profilePicture||"https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png"}
                      alt={employee.name}
                      className="w-32 h-32 rounded-full border-4 border-white mb-4"
                    />
                    <h3 className="text-xl font-semibold text-white">{employee.name}</h3>
                    <p className="text-sm text-white">{employee.position}</p>

                    <Button
                      type="primary"
                      className="mt-4"
                      onClick={() => console.log(`Set task for ${employee.name}`)}
                    >
                      Set Task
                    </Button>
                  </div>
                </motion.div>
              </List.Item>
            )}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Team;

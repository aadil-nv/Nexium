import React, { useState, useEffect } from "react";
import { Input, List, Skeleton, Empty, Card, Select, Pagination, Tag, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Mail, 
  Briefcase, 
  Filter, 
  Building2, 
  ChevronDown, 
  Circle,
} from "lucide-react";
import useTheme from "../../hooks/useTheme";
import { employeeInstance } from "../../services/employeeInstance";

interface Employee {
  id: number;
  name: string;
  position: string;
  isActive: boolean;
  profilePicture?: string;
  email: string;
}

interface Department {
  departmentName?: string;
  employees: Employee[];
}

const { Option } = Select;

const Team: React.FC = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [positionFilter, setPositionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [itemsPerPage] = useState(8);
  const { themeColor } = useTheme();
  const [department, setDepartment] = useState<Department | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await employeeInstance.get(
          "/employee-service/api/department/get-mydepartment"
        );
        setDepartment(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching department:", error);
        setLoading(false);
      }
    };

    fetchDepartment();
  }, []);

  const getUniquePositions = () => {
    const positions = department?.employees.map(emp => emp.position) || [];
    return [...new Set(positions)];
  };

  const filteredEmployees = department?.employees?.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase()) ||
                         employee.email.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = !positionFilter || employee.position === positionFilter;
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && employee.isActive) ||
                         (statusFilter === 'inactive' && !employee.isActive);
    
    return matchesSearch && matchesPosition && matchesStatus;
  }) || [];

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <Card className="shadow-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-3 rounded-full"
                style={{ backgroundColor: `${themeColor}22` }}
              >
                <Building2 size={24} color={themeColor} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {loading ? (
                    <Skeleton.Input active style={{ width: 200 }} />
                  ) : department?.departmentName ? (
                    department.departmentName
                  ) : (
                    "No Department Assigned"
                  )}
                </h1>
                <p className="text-gray-500">
                  {filteredEmployees.length} Team Members
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Input
          prefix={<Search className="text-gray-400" size={20} />}
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg"
          size="large"
        />
        
        <Select
          placeholder="Filter by Position"
          allowClear
          value={positionFilter}
          onChange={setPositionFilter}
          className="w-full"
          size="large"
          suffixIcon={<ChevronDown size={20} />}
        >
          {getUniquePositions().map((position) => (
            <Option key={position} value={position}>{position}</Option>
          ))}
        </Select>

        <Select
          placeholder="Filter by Status"
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full"
          size="large"
          suffixIcon={<ChevronDown size={20} />}
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>

        <Button 
          icon={<Filter size={20} />}
          size="large"
          onClick={() => {
            setSearch("");
            setPositionFilter("");
            setStatusFilter("");
          }}
        >
          Clear Filters
        </Button>
      </motion.div>

      {/* Employee Grid */}
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <Card key={idx}>
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Card>
              ))}
            </div>
          ) : paginatedEmployees.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No team members found"
            />
          ) : (
            <List
              grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={paginatedEmployees}
              renderItem={(employee) => (
                <List.Item>
                  <motion.div variants={itemVariants}>
                    <Card
                      hoverable
                      className="overflow-hidden relative"
                      bodyStyle={{ padding: 0 }}
                    >
                      {/* Status Indicator */}
                      <div className="absolute top-4 right-4 z-10">
                        <Tag 
                          color={employee.isActive ? "success" : "error"}
                          icon={<Circle size={12} className="mr-1" />}
                        >
                          {employee.isActive ? "Active" : "Inactive"}
                        </Tag>
                      </div>

                      {/* Profile Section */}
                      <div 
                        className="p-6 text-center"
                        style={{ 
                          background: `linear-gradient(135deg, ${themeColor}11, ${themeColor}22)`
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="inline-block"
                        >
                          <img
                            src={employee.profilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png"}
                            alt={employee.name}
                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
                          />
                        </motion.div>
                      </div>

                      {/* Details Section */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-center mb-4">
                          {employee.name}
                        </h3>

                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <Briefcase size={16} className="mr-2" />
                            <span className="truncate">{employee.position}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail size={16} className="mr-2" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </List.Item>
              )}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {filteredEmployees.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex justify-center"
        >
          <Pagination
            current={currentPage}
            total={filteredEmployees.length}
            pageSize={itemsPerPage}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Team;
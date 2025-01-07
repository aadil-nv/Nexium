import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Select, Button, Card, Badge, Pagination } from 'antd';
import { DownloadOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

// Demo data
const projectsData = [
  {
    id: 1,
    title: "E-commerce Platform Redesign",
    status: "In Progress",
    deadline: "2025-02-15",
    priority: "High",
    assignedTo: "John Doe",
    attachmentUrl: "/files/project1.pdf",
    description: "Redesign the user interface of our e-commerce platform",
  },
  {
    id: 2,
    title: "Mobile App Development",
    status: "Pending",
    deadline: "2025-03-20",
    priority: "Medium",
    assignedTo: "Jane Smith",
    attachmentUrl: "/files/project2.pdf",
    description: "Develop a native mobile app for iOS and Android",
  },
  {
    id: 3,
    title: "Database Optimization",
    status: "Completed",
    deadline: "2025-01-30",
    priority: "Low",
    assignedTo: "Mike Johnson",
    attachmentUrl: "/files/project3.pdf",
    description: "Optimize database queries for better performance",
  }
];

const statusColors = {
  'Completed': '#52c41a',
  'In Progress': '#1890ff',
  'Pending': '#faad14'
};

const priorityColors = {
  'High': '#ff4d4f',
  'Medium': '#faad14',
  'Low': '#52c41a'
};

export default function Project() {
  const [projects, setProjects] = useState(projectsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleStatusChange = (projectId, newStatus) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
  };

  const filteredProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'All' || project.status === statusFilter)
    );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const downloadFile = (url) => {
    // In a real application, implement actual file download logic
    console.log(`Downloading file from: ${url}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <Input
          placeholder="Search projects..."
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          defaultValue="All"
          style={{ width: 150 }}
          onChange={setStatusFilter}
          prefix={<FilterOutlined />}
        >
          <Option value="All">All Status</Option>
          <Option value="Completed">Completed</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Pending">Pending</Option>
        </Select>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {paginatedProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                hoverable
                className="h-full"
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-bold truncate">{project.title}</span>
                    <Badge
                      color={statusColors[project.status]}
                      text={project.status}
                    />
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-gray-600">{project.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <Badge color={priorityColors[project.priority]} text={project.priority} />
                    <span className="text-gray-500">Due: {project.deadline}</span>
                  </div>
                  
                  <div className="text-gray-600">
                    Assigned to: {project.assignedTo}
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Select
                      value={project.status}
                      style={{ width: 130 }}
                      onChange={(value) => handleStatusChange(project.id, value)}
                    >
                      <Option value="Pending">Pending</Option>
                      <Option value="In Progress">In Progress</Option>
                      <Option value="Completed">Completed</Option>
                    </Select>

                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() => downloadFile(project.attachmentUrl)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Pagination
          current={currentPage}
          total={filteredProjects.length}
          pageSize={pageSize}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
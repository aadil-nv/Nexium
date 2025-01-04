import React, { useState } from 'react';
import { Button, Table, Input, Space, Tag, Tooltip, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AddProjectModal from './AddProjectModal';
import EditProjectModal from './EditProjectModal';
import type { ColumnsType } from 'antd/es/table';
import { motion } from 'framer-motion';

interface ProjectData {
  id: string;
  name: string;
  teamLead: string;
  status: 'pending' | 'inProgress' | 'completed';
  dueDate: string;
}

const Projects = () => {
  // Demo data
  const demoProjects: ProjectData[] = [
    { id: '1', name: 'Project A', teamLead: 'John Doe', status: 'inProgress', dueDate: '2025-01-20' },
    { id: '2', name: 'Project B', teamLead: 'Jane Smith', status: 'pending', dueDate: '2025-02-15' },
    { id: '3', name: 'Project C', teamLead: 'Alice Johnson', status: 'completed', dueDate: '2024-12-10' },
  ];

  const [projects, setProjects] = useState<ProjectData[]>(demoProjects);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const statusColors = {
    pending: 'orange',
    inProgress: 'blue',
    completed: 'green',
  };

  const columns: ColumnsType<ProjectData> = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [],
      onFilter: (value, record) => record.name.toLowerCase().includes((value as string).toLowerCase()),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search project"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} size="small">
              Search
            </Button>
            <Button onClick={() => clearFilters?.()} size="small">
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: 'Team Lead',
      dataIndex: 'teamLead',
      key: 'teamLead',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'In Progress', value: 'inProgress' },
        { text: 'Completed', value: 'completed' },
      ],
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Project">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="link" />
          </Tooltip>
          <Tooltip title="Delete Project">
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} type="link" danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (project: ProjectData) => {
    setSelectedProject(project);
    setIsEditModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this project?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        setProjects(projects.filter(project => project.id !== id));
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '24px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px' }}>Projects</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
          size="large"
        >
          Add Project
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        pagination={{
          total: projects.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onChange={(pagination, filters, sorter) => {
          console.log('Table params:', { pagination, filters, sorter });
        }}
      />

      <AddProjectModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSave={(newProject) => {
          setProjects([...projects, newProject]);
          setIsAddModalVisible(false);
        }}
      />

      <EditProjectModal
        visible={isEditModalVisible}
        project={selectedProject}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedProject(null);
        }}
        onSave={(updatedProject) => {
          setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
          setIsEditModalVisible(false);
          setSelectedProject(null);
        }}
      />
    </motion.div>
  );
};

export default Projects;

import { useState, useEffect } from 'react';
import { Button, Table, Input, Space, Tag, Tooltip, Modal, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AddProjectDrawer from './AddProjectDrawer';
import EditProjectDrawer from './EditProjectDrawer';
import type { ColumnsType } from 'antd/es/table';
import { motion, AnimatePresence } from 'framer-motion';
import { managerInstance } from '../../../services/managerInstance';

interface ProjectFile {
  fileUrl: string;
}

interface AssignedEmployee {
  employeeName: string;
  employeeFiles?: ProjectFile[];
}

type ProjectStatus = 'pending' | 'inProgress' | 'completed' | 'notStarted';
type ManagerStatus = 'assigned' | 'underEvaluation' | 'approved' | 'rejected' | 'onHold' | 'inProgress' | 'requiresClarification' | 'escalated';

interface ProjectDataFromAPI {
  projectId: string;
  projectName: string;
  assignedEmployee?: AssignedEmployee;
  description: string;
  status: ProjectStatus;
  endDate: string;
  projectFiles: ProjectFile[];
  managerStatus: ManagerStatus;
}

interface ProjectData {
  id: string;
  projectName: string;
  teamLead: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
  file: string | null;
  employeeFiles: string;
  managerStatus: ManagerStatus;
}

const statusColors: Record<ProjectStatus, string> = {
  notStarted: 'orange',
  pending: 'orange',
  inProgress: 'blue',
  completed: 'green',
};

const managerStatusColors: Record<ManagerStatus, string> = {
  assigned: 'blue',
  underEvaluation: 'gold',
  approved: 'green',
  rejected: 'red',
  onHold: 'orange',
  inProgress: 'blue',
  requiresClarification: 'purple',
  escalated: 'magenta'
};

const Projects = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const columns: ColumnsType<ProjectData> = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      render: text => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{text}</motion.div>
    },
    {
      title: 'Team Lead',
      dataIndex: 'teamLead',
      render: text => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{text}</motion.div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: ProjectStatus) => (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Tag color={statusColors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
        </motion.div>
      ),
    },
    {
      title: 'Manager Status',
      dataIndex: 'managerStatus',
      render: (status: ManagerStatus) => (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Tag color={managerStatusColors[status]}>
            {status.split(/(?=[A-Z])/).join(' ').replace(/^./, str => str.toUpperCase())}
          </Tag>
        </motion.div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: dueDate => {
        const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            <div>{new Date(dueDate).toLocaleDateString()}</div>
            <Tag color={days < 0 ? 'red' : 'green'}>{days < 0 ? 'Overdue' : 'On Track'}</Tag>
            <div>{Math.abs(days)} days {days < 0 ? 'overdue' : 'left'}</div>
          </motion.div>
        );
      },
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Space>
            <Tooltip title="Edit Project">
              <Button icon={<EditOutlined />} onClick={() => { setSelectedProject(record); setIsEditVisible(true); }} type="link" />
            </Tooltip>
            <Tooltip title="Delete Project">
              <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} type="link" danger />
            </Tooltip>
          </Space>
        </motion.div>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Project',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      onOk: async () => {
        try {
          await managerInstance.delete(`/manager-service/api/projects/delete-project/${id}`);
          setProjects(prev => prev.filter(p => p.id !== id));
          notification.success({ message: 'Project deleted successfully' });
        } catch (error) {
          console.log("Error deleting project:", error);  
          notification.error({message: 'Failed to delete project' });
        }
      },
    });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data } = await managerInstance.get<ProjectDataFromAPI[]>('/manager-service/api/projects/get-all-projects');
        
        setProjects(data.map((p): ProjectData => ({
          id: p.projectId,
          projectName: p.projectName || 'N/A',
          teamLead: p.assignedEmployee?.employeeName || 'N/A',
          description: p.description || 'No description provided',
          status: p.status || 'notStarted',
          dueDate: p.endDate || 'No due date',
          file: p.projectFiles[0]?.fileUrl || null,
          employeeFiles: p.assignedEmployee?.employeeFiles?.map(file => file.fileUrl).join(', ') || 'No files',
          managerStatus: p.managerStatus || 'assigned'
        })));
      } catch (error) {
        console.log("Error fetching projects:", error);
        notification.error({ message: 'Failed to fetch projects' });
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const filteredData = projects.filter(project => 
    project.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
    project.teamLead.toLowerCase().includes(searchText.toLowerCase()) ||
    project.status.toLowerCase().includes(searchText.toLowerCase()) ||
    project.managerStatus.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Projects</h1>
        <Space>
          <Input
            placeholder="Search projects..."
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddVisible(true)} size="large">
            Add Project
          </Button>
        </Space>
      </div>

      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={{ 
              total: filteredData.length,
              pageSize: 5,
              showQuickJumper: true,
              position: ['bottomCenter']
            }}
          />
        </motion.div>
      </AnimatePresence>

      <AddProjectDrawer
        visible={isAddVisible}
        onCancel={() => setIsAddVisible(false)}
        onSave={(newProject) => {
          setProjects(prev => [newProject, ...prev]);
          setIsAddVisible(false);
        }}
      />

      <EditProjectDrawer
        visible={isEditVisible}
        project={selectedProject}
        onCancel={() => {
          setIsEditVisible(false);
          setSelectedProject(null);
        }}
        onSave={(updated) => {
          setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
          setIsEditVisible(false);
        }}
      />
    </motion.div>
  );
};

export default Projects;
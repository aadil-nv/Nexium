import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Select, DatePicker, notification, Alert, Space, Tag, Button, Upload, Image } from 'antd';
import {CalendarOutlined, WarningOutlined, ProjectOutlined, UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import { managerInstance } from '../../../services/managerInstance';
import { AxiosError } from 'axios';


interface ProjectData {
  id: string;
  projectName: string;
  teamLead: string;
  status: 'pending' | 'inProgress' | 'completed' | 'notStarted';
  dueDate: string;
  file: string | null;
  employeeFiles: string;
  description: string;
  managerStatus: 'assigned' | 'underEvaluation' | 'approved' | 'rejected' | 'onHold' | 'inProgress' | 'requiresClarification'| 'escalated';
}

interface TeamLead {
  id: string;
  name: string;
}

interface EditProjectDrawerProps {
  visible: boolean;
  project: ProjectData | null;
  onCancel: () => void;
  onSave: (project: ProjectData) => void;
}

const managerStatusOptions = {
  assigned: { color: '#1890ff', label: 'Assigned' },
  underEvaluation: { color: '#faad14', label: 'Under Evaluation' },
  approved: { color: '#52c41a', label: 'Approved' },
  rejected: { color: '#f5222d', label: 'Rejected' },
  onHold: { color: '#fa8c16', label: 'On Hold' },
  inProgress: { color: '#1890ff', label: 'In Progress' },
  requiresClarification: { color: '#722ed1', label: 'Requires Clarification' },
  escalated: { color: '#eb2f96', label: 'Escalated' }
};

const EditProjectDrawer: React.FC<EditProjectDrawerProps> = ({ visible, project, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [file, setFile] = useState<string | null>(project?.file || null);
  const [employeeFiles, setEmployeeFiles] = useState<string>(project?.employeeFiles || '');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const statusColors = {
      pending: '#faad14',
      inProgress: '#1890ff',
      completed: '#52c41a',
      notStarted: '#d9d9d9'
    };
    return statusColors[status as keyof typeof statusColors];
  };

  const getStatusTag = (status: string) => {
    const statusLabels = {
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      notStarted: 'Not Started'
    };
    return (
      <Tag color={getStatusColor(status)} style={{ fontSize: '14px', padding: '4px 12px' }}>
        {statusLabels[status as keyof typeof statusLabels]}
      </Tag>
    );
  };

  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const response = await managerInstance.get('/manager-service/api/projects/get-all-teamleads');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTeamLeads(response.data.map((lead: any) => ({ id: lead.employeeId, name: lead.employeeName })));
      } catch (error) {
        const message = error instanceof AxiosError ? error.response?.data?.message : 'An unexpected error occurred';
       notification.error({
        message: 'Error',
        description: message,
      });
      }
    };

    if (visible) {
      fetchTeamLeads();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && project) {
      form.setFieldsValue({
        ...project,
        dueDate: moment(project.dueDate),
      });
      setShowWarning(project.status !== 'completed');
      setFile(project.file);
      setEmployeeFiles(project.employeeFiles);
      setFilePreview(null);
      setNewFile(null);
    }
  }, [visible, project, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileSelect = (info: any) => {
    console.log("TYPE of info",typeof info);
    
    const file = info.file.originFileObj;
    if (file) {
      setNewFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setNewFile(null);
    setFilePreview(null);
  };

  const handleUpdateFile = async () => {
    if (!newFile || !project?.id) return;

    const formData = new FormData();
    formData.append('file', newFile);

    try {
      const response = await managerInstance.post(`/manager-service/api/projects/update-project-file/${project.id}`, formData);
      setFile(response.data.fileUrl);
      setNewFile(null);
      setFilePreview(null);
      notification.success({
        message: 'Success',
        description: 'Project file updated successfully',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update project file',
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const updatedProject = {
        ...project,
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        file: file,
        employeeFiles: employeeFiles
      };

      await managerInstance.put(`/manager-service/api/projects/update-project/${project?.id}`, updatedProject);
      notification.success({
        message: 'Success',
        description: 'Project updated successfully',
      });
      onSave(updatedProject);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update project',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFileSection = () => {
    if (filePreview) {
      return (
        <Space direction="vertical" size="middle">
          <Image src={filePreview} alt="File preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          <Space>
            <Button type="primary" onClick={handleUpdateFile}>
              Update File
            </Button>
            <Button danger onClick={handleFileRemove}>
              Cancel
            </Button>
          </Space>
        </Space>
      );
    }

    if (file) {
      const isImage = file.match(/\.(jpg|jpeg|png|gif)$/i);
      return (
        <Space direction="vertical" size="middle">
          {isImage && (
            <Image src={file} alt="Project file" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          )}
          <Space>
            <Button type="link" icon={<DownloadOutlined />} href={file} target="_blank">
              Download Project File
            </Button>
            <Button icon={<DeleteOutlined />} onClick={handleFileRemove} danger>
              Remove
            </Button>
          </Space>
        </Space>
      );
    }

    return (
      <Upload
        beforeUpload={() => false}
        onChange={handleFileSelect}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />} size="large">
          Upload Project File
        </Button>
      </Upload>
    );
  };

  const renderEmployeeFiles = () => {
    if (!employeeFiles) {
      return <Alert message="No employee files uploaded" type="info" />;
    }

    const isImage = employeeFiles.match(/\.(jpg|jpeg|png|gif)$/i);
    return (
      <Space direction="vertical" size="middle">
        {isImage && (
          <Image src={employeeFiles} alt="Employee files" style={{ maxWidth: '200px', maxHeight: '200px' }} />
        )}
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          href={employeeFiles}
          target="_blank"
          ghost
        >
          Download Employee Files
        </Button>
      </Space>
    );
  };

  return (
    <Drawer
      title={
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Space align="center">
            <ProjectOutlined style={{ fontSize: '20px' }} />
            <span style={{ fontSize: '18px', fontWeight: 600 }}>Edit Project</span>
          </Space>
        </motion.div>
      }
      visible={visible}
      onClose={onCancel}
      width={600}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Save Changes
          </Button>
        </Space>
      }
    >
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              message="Project Reassignment Warning"
              description="Changing the team lead for an incomplete project will trigger a notification."
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              style={{ marginBottom: 24 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Form form={form} layout="vertical" style={{ maxWidth: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Form.Item name="projectName" label="Project Name" rules={[{ required: true, message: 'Please enter project name' }]}>
            <Input placeholder="Project name" size="large" />
          </Form.Item>

          <Form.Item name="description" label="Project Description" rules={[{ required: true, message: 'Please enter project description' }]}>
            <Input.TextArea 
              placeholder="Enter project description" 
              size="large" 
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item name="teamLead" label="Team Lead" rules={[{ required: true, message: 'Please select a team lead' }]}>
            <Select placeholder="Select team lead" showSearch size="large">
              {teamLeads.map(lead => <Select.Option key={lead.id} value={lead.id}>{lead.name}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="managerStatus" label="Manager Status" rules={[{ required: true, message: 'Please select manager status' }]}>
            <Select
              placeholder="Select manager status"
              size="large"
              dropdownStyle={{ padding: '8px' }}
            >
              {Object.entries(managerStatusOptions).map(([value, { color, label }]) => (
                <Select.Option key={value} value={value}>
                  <Tag color={color} style={{ padding: '4px 8px', width: '100%' }}>
                    {label}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Project Status">
            <div style={{ padding: '8px 0' }}>
              {project && getStatusTag(project.status)}
            </div>
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Please select a due date' }]}>
            <DatePicker
              placeholder="Select due date"
              style={{ width: '100%' }}
              suffixIcon={<CalendarOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Project Files">
            {renderFileSection()}
          </Form.Item>

          <Form.Item label="Employee Files">
            {renderEmployeeFiles()}
          </Form.Item>
        </motion.div>
      </Form>
    </Drawer>
  );
};

export default EditProjectDrawer;
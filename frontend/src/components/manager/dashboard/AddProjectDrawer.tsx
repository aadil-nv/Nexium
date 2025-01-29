import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Select, DatePicker, Upload, Button, notification, Space, Divider, UploadFile } from 'antd';
import { ProjectOutlined, SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { employeeInstance } from '../../../services/employeeInstance';
import { managerInstance } from '../../../services/managerInstance';

interface TeamLead {
  id: string;
  name: string;
}

interface ProjectResponse {
  projectId: string;
  projectName: string;
  description: string;
  managerStatus: 'assigned' | 'underEvaluation' | 'approved' | 'rejected' | 'onHold' | 'inProgress' | 'requiresClarification' | 'escalated';
  projectFiles?: { fileUrl: string }[];
}

// Define types for saved project
interface Project {
  id: string;
  projectName: string;
  teamLead: string;
  description: string;
  status: 'pending' | 'inProgress' | 'completed' | 'notStarted';
  dueDate: string;
  file: string | null;
  employeeFiles: string;
  managerStatus: 'assigned' | 'underEvaluation' | 'approved' | 'rejected' | 'onHold' | 'inProgress' | 'requiresClarification' | 'escalated';
}

interface AddProjectDrawerProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (project: Project) => void;
}

const AddProjectDrawer: React.FC<AddProjectDrawerProps> = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (visible) {
      managerInstance.get('/manager-service/api/projects/get-all-teamleads')
        .then(response => setTeamLeads(response.data.map((lead: {employeeId: string, employeeName: string}) => ({ id: lead.employeeId, name: lead.employeeName }))))
        .catch(console.error);
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        projectName: values.projectName,
        description: values.description,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        teamLeadId: values.teamLead,
        projectFiles: fileList.map(({ name, type, size }) => ({ name, type, size })),
      };

      const response = await employeeInstance.post<ProjectResponse>('/manager-service/api/projects/add-new-project', payload);
      
      const newProject: Project = {
        id: response.data.projectId,
        projectName: response.data.projectName,
        teamLead: teamLeads.find(lead => lead.id === values.teamLead)?.name || 'N/A',
        status: 'notStarted',
        dueDate: values.endDate.format('YYYY-MM-DD'),
        description: response.data.description,
        managerStatus: response.data.managerStatus,
        file: response.data.projectFiles?.[0]?.fileUrl || null,
        employeeFiles: response.data.projectFiles?.map(file => file.fileUrl).join(', ') || 'No files',
      };

      notification.success({ message: 'Success', description: 'Project created successfully' });
      onSave(newProject);
      handleClose();
    } catch (error) {
      notification.error({ message: 'Error', description: (error as Error).message || 'Failed to create project' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  return (
    <Drawer title="Add New Project" placement="right" onClose={onCancel} open={visible} width={600} extra={
      <Space>
        <Button onClick={onCancel} icon={<CloseOutlined />}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />}>Save</Button>
      </Space>
    }>
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item name="projectName" label="Project Name" rules={[{ required: true, message: 'Project name is required' }]}>
          <Input prefix={<ProjectOutlined />} placeholder="Enter project name" size="large" />
        </Form.Item>

        <Form.Item name="teamLead" label="Team Lead" rules={[{ required: true, message: 'Team lead is required' }]}>
          <Select placeholder="Select team lead" showSearch size="large">
            {teamLeads.map(lead => <Select.Option key={lead.id} value={lead.id}>{lead.name}</Select.Option>)}
          </Select>
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
            <DatePicker format="YYYY-MM-DD" size="large" disabledDate={current => current && current < moment().startOf('day')} />
          </Form.Item>
          <Form.Item name="endDate" label="End Date" rules={[
            { required: true, message: 'End date is required' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                return value && getFieldValue('startDate') <= value ? Promise.resolve() : Promise.reject('End date must be after start date');
              },
            })
          ]}>
            <DatePicker format="YYYY-MM-DD" size="large" disabledDate={current => current && current < form.getFieldValue('startDate')} />
          </Form.Item>
        </div>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Description is required' }]}>
          <Input.TextArea rows={4} placeholder="Enter project description" size="large" />
        </Form.Item>

        <Divider />

        <Form.Item label="Project Files" name="projectFiles">
          <Upload 
            fileList={fileList} 
            onRemove={(file) => setFileList(fileList.filter(item => item.uid !== file.uid))} 
            beforeUpload={(file) => { 
              const uploadFile: UploadFile = {
                ...file,
                uid: Date.now().toString(),
                name: file.name,
              };
              setFileList([...fileList, uploadFile]); 
              return false; 
            }}
          >
            <Button icon={<UploadOutlined />} size="large" block>Select Files</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddProjectDrawer;
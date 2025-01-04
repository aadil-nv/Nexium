import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, notification, Alert, Space, Tag } from 'antd';
import { UserOutlined, CalendarOutlined, WarningOutlined, ProjectOutlined } from '@ant-design/icons';
import moment from 'moment';

interface ProjectData {
  id: string;
  name: string;
  teamLead: string;
  status: 'pending' | 'inProgress' | 'completed';
  dueDate: string;
  description?: string;
}

interface TeamLead {
  id: string;
  name: string;
}

interface EditProjectModalProps {
  visible: boolean;
  project: ProjectData | null;
  onCancel: () => void;
  onSave: (project: ProjectData) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  visible,
  project,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const statusOptions = [
    { label: 'Pending', value: 'pending', color: 'orange' },
    { label: 'In Progress', value: 'inProgress', color: 'blue' },
    { label: 'Completed', value: 'completed', color: 'green' }
  ];

  useEffect(() => {
    if (visible && project) {
      form.setFieldsValue({
        ...project,
        dueDate: moment(project.dueDate),
      });
      setShowWarning(project.status !== 'completed');
    }
  }, [visible, project, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
    //   setLoading(true);

      const updatedProject = {
        ...project,
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
      };

      if (values.teamLead !== project?.teamLead && values.status !== 'completed') {
        await sendWarningEmail(project?.teamLead, values.teamLead, project?.name);
      }

      onSave(updatedProject);
    } catch (error) {
      notification.error({
        message: 'Validation Error',
        description: 'Please check all required fields',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendWarningEmail = async (oldTeamLead: any, newTeamLead: string, projectName: any) => {
    try {
      await fetch('/api/send-warning-email', {
        method: 'POST',
        body: JSON.stringify({ oldTeamLead, newTeamLead, projectName }),
      });
      notification.success({
        message: 'Warning Email Sent',
        description: 'Reassignment notification sent successfully',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to send warning email',
      });
    }
  };

  return (
    <Modal
      title={
        <Space align="center">
          <ProjectOutlined />
          <span>Edit Project</span>
        </Space>
      }
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      {showWarning && (
        <Alert
          message="Project Reassignment Warning"
          description="Changing the team lead for an incomplete project will trigger a notification."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{ status: 'pending' }}
      >
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: 'Please enter project name' }]}
        >
          <Input 
            prefix={<ProjectOutlined />}
            disabled={project?.status === 'completed'}
            placeholder="Enter project name"
          />
        </Form.Item>

        <Form.Item
  name="teamLead"
  label="Team Lead"
  rules={[{ required: true, message: 'Please select team lead' }]}
>
  <Select
    disabled={project?.status === 'completed'}
    showSearch
    placeholder="Select team lead"
    filterOption={(input, option) => {
      // Ensure option?.label is defined and convert to string for comparison
      const label = option?.label as string | undefined;
      return label ? label.toLowerCase().includes(input.toLowerCase()) : false;
    }}
    options={teamLeads.map(lead => ({
      label: lead.name,
      value: lead.id,
    }))}
  />
</Form.Item>


        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            {statusOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                <Tag color={option.color}>{option.label}</Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select due date' }]}
        >
          <DatePicker 
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder="Select due date"
            suffixIcon={<CalendarOutlined />}
            disabledDate={current => current && current < moment().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea 
            rows={4}
            placeholder="Enter project description"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="comments"
          label="Reassignment Comments"
        >
          <Input.TextArea 
            rows={3}
            placeholder="Add any comments about the project reassignment"
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;

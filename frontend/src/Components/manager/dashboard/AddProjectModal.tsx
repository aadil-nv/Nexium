import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, notification } from 'antd';
import { UserOutlined, CalendarOutlined, ProjectOutlined } from '@ant-design/icons';
import moment from 'moment';

interface TeamLead {
  id: string;
  name: string;
}

interface AddProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (project: any) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch team leads
    const fetchTeamLeads = async () => {
      try {
        // Replace with your API call
        const response = await fetch('/api/team-leads');
        const data = await response.json();
        setTeamLeads(data);
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch team leads',
        });
      }
    };

    if (visible) {
      fetchTeamLeads();
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
    //   setLoading(true);
      
      const projectData = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        status: 'pending',
        id: Date.now().toString(),
      };

      onSave(projectData);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Validation Error',
        description: 'Please check all required fields',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Project"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: 'Please enter project name' }]}
        >
          <Input 
            prefix={<ProjectOutlined />} 
            placeholder="Enter project name"
          />
        </Form.Item>

        <Form.Item
          name="teamLead"
          label="Team Lead"
          rules={[{ required: true, message: 'Please select team lead' }]}
        >
          <Select
  placeholder="Select team lead"
  showSearch
  filterOption={(input, option) => {
    return (
      option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
    );
  }}
>
  {teamLeads.map((lead) => (
    <Select.Option key={lead.id} value={lead.id}>
      {lead.name}
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
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
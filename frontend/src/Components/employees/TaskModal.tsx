import React, { useState, useEffect } from 'react';
import { Modal, Input, DatePicker, Button, Select, Row, Col, Divider, notification } from 'antd';
import { PlusOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import { employeeInstance } from '../../services/employeeInstance';
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/slices/taskSlice';

interface SubTask {
  title: string;
  priority: string;
  description: string;
  isCompleted: boolean;
  _id?: string;
  taskStatus?: string;
  response?: string;
}

interface Task {
  _id?: string;
  employeeProfilePicture: string;
  employeeName: string;
  dueDate: string;
  assignedBy: string;
  assigenedDate: string;
  taskName: string;
  isApproved?: boolean;
  tasks: SubTask[];
  employeeId?: string;
}

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (taskData: Task) => void;
}

const priorityColors = {
  low: '#52c41a',
  medium: '#faad14',
  high: '#f5222d'
};

const TaskModal: React.FC<TaskModalProps> = ({ visible, onCancel ,onSave }) => {
  const dispatch = useDispatch();
  const [employeeId, setEmployeeId] = useState<string>('');
  const [dueDate, setDueDate] = useState<moment.Moment | null>(null);
  const [taskName, setTaskName] = useState<string>('');
  const [tasks, setTasks] = useState<{ title: string; description?: string; priority?: 'low' | 'medium' | 'high' }[]>([{ title: '', description: '', priority: 'low' }]);
  const [availableEmployees, setAvailableEmployees] = useState<{ _id: string, name: string, profilePicture?: string }[]>([]);

  useEffect(() => {
    if (visible) {
      const fetchEmployeesWithoutTask = async () => {
        try {
          const response = await employeeInstance.get('/employee-service/api/task/get-employee-without-task');
          if (Array.isArray(response.data)) {
            setAvailableEmployees(response.data);
          }
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
      fetchEmployeesWithoutTask();
    }
  }, [visible]);

  const handleTaskChange = (index: number, field: string, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const addTaskItem = () => {
    setTasks([...tasks, { title: '', description: '', priority: 'low' }]);
  };

  const removeTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };


  const handleSave = async () => {
    if (!employeeId || !dueDate || !taskName) {
      notification.error({
        message: 'Required Fields Missing',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const employee = availableEmployees.find((emp) => emp._id === employeeId);
    if (!employee) return;

    const taskData: Task = {
      employeeId: employeeId.toString(),
      employeeName: employee.name || '',
      employeeProfilePicture: employee.profilePicture || '',
      dueDate: dueDate.toISOString(), // Convert to ISO string
      assignedBy: 'current_user', // You might want to replace this with actual current user
      assigenedDate: new Date().toISOString(),
      taskName,
      tasks: tasks.map((task) => ({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'low',
        isCompleted: false,
      })),
    };

    try {
      const response = await employeeInstance.post('/employee-service/api/task/assign-task-to-employee', taskData);
      dispatch(addTask(response.data));
      onSave(response.data); // Call onSave with the response data
      notification.success({
        message: 'Success',
        description: 'Tasks assigned successfully.',
      });
      setEmployeeId('');
      setDueDate(null);
      setTaskName('');
      setTasks([{ title: '', description: '', priority: 'low' }]);
      onCancel();
    } catch (error) {
      notification.error({message: 'Error', description: (error as Error).message || 'Failed to assign tasks.' });
    }
  };

  const inputStyle = {
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    '.ant-input': {
      padding: '8px 12px'
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: '20px', fontWeight: 600, color: '#1f1f1f', padding: '8px 0' }}>
          Assign Tasks to Employee
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      width={800}
      bodyStyle={{ 
        padding: '24px',
        borderRadius: '12px'
      }}
    >
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ color: '#666', marginBottom: '4px', display: 'block' }}>
                Employee
              </label>
              <Select
                placeholder="Select Employee"
                value={employeeId}
                onChange={setEmployeeId}
                style={{ width: '100%', ...inputStyle }}
                suffixIcon={<UserOutlined />}
              >
                {availableEmployees.map(employee => (
                  <Select.Option key={employee._id} value={employee._id}>
                    {employee.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Col>
          
          <Col span={12}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ color: '#666', marginBottom: '4px', display: 'block' }}>
                Due Date
              </label>
              <DatePicker
                placeholder="Select Due Date"
                value={dueDate}
                onChange={setDueDate}
                style={{ width: '100%', ...inputStyle }}
                suffixIcon={<CalendarOutlined />}
              />
            </div>
          </Col>
          
          <Col span={12}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ color: '#666', marginBottom: '4px', display: 'block' }}>
                Task Name
              </label>
              <Input
                placeholder="Enter Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                style={inputStyle}
                prefix={<FileTextOutlined />}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '16px 0', borderColor: '#e8e8e8' }}>
        <span style={{ color: '#666', fontWeight: 500 }}>Task Details</span>
      </Divider>

      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
        {tasks.map((task, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e8e8e8',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={24} md={8}>
                <Input
                  placeholder="Task Title"
                  value={task.title}
                  onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                  style={inputStyle}
                />
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Input.TextArea
                  placeholder="Description"
                  value={task.description}
                  onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                  style={{ ...inputStyle, minHeight: '60px' }}
                />
              </Col>
              <Col xs={20} sm={20} md={6}>
                <Select
                  placeholder="Priority"
                  value={task.priority}
                  onChange={(value) => handleTaskChange(index, 'priority', value)}
                  style={{ width: '100%', ...inputStyle }}
                >
                  {Object.entries(priorityColors).map(([priority, color]) => (
                    <Select.Option key={priority} value={priority}>
                      <span style={{ color }}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={4} sm={4} md={2} style={{ textAlign: 'right' }}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeTask(index)}
                  disabled={tasks.length === 1}
                  style={{ borderRadius: '6px' }}
                />
              </Col>
            </Row>
          </div>
        ))}
      </div>

      <Button
        type="dashed"
        onClick={addTaskItem}
        icon={<PlusOutlined />}
        style={{
          width: '100%',
          marginTop: '16px',
          borderRadius: '6px',
          height: '40px',
          borderColor: '#1890ff',
          color: '#1890ff'
        }}
      >
        Add Task
      </Button>
    </Modal>
  );
};

export default TaskModal;
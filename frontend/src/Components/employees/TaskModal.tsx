import React, { useState, useEffect } from 'react';
import { Modal, Input, DatePicker, Button, Select, Row, Col, Divider, notification } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Moment } from 'moment';
import moment from 'moment';
import { employeeInstance } from '../../services/employeeInstance';

// Define ITaskDTO structure
interface ITaskDTO {
  employeeId: string;
  dueDate: Date;
  employeeName: string;
  employeeProfilePicture?: string;
  tasks: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
  }[];
}

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (taskData: ITaskDTO) => void; // Expecting ITaskDTO
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onCancel, onSave }) => {
  const [employeeId, setEmployeeId] = useState<string>(''); // Track employeeId
  const [dueDate, setDueDate] = useState<Moment | null>(null); // Track due date
  const [tasks, setTasks] = useState<{ title: string; description?: string; priority?: 'low' | 'medium' | 'high' }[]>([{ title: '', description: '', priority: 'low' }]); // Tasks state
  const [availableEmployees, setAvailableEmployees] = useState<{ _id: string, name: string , profilePicture?: string }[]>([]); // Available employees state

  // Fetch employees without tasks when the modal is opened
  useEffect(() => {
    if (visible) {
      const fetchEmployeesWithoutTask = async () => {
        try {
          const response = await employeeInstance.get('/employee/api/task/get-employee-without-task');
          if (Array.isArray(response.data)) {
            setAvailableEmployees(response.data); // Populate available employees
          } else {
            console.error('Expected an array of employees, but got:', response.data);
          }
        } catch (error) {
          console.error('Error fetching employees without tasks:', error);
        }
      };
      fetchEmployeesWithoutTask();
    }
  }, [visible]);

  // Log available employees for debugging
  console.log("Available employees:", availableEmployees);

  const handleTaskChange = (index: number, field: string, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { title: '', description: '', priority: 'low' }]);
  };

  const removeTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleSave = async () => {
    console.log("Employee ID before save:", employeeId); // Check employeeId before sending request
    if (!employeeId || !dueDate) {
      console.error("Missing employeeId or dueDate"); // Check if values are missing
      return; // Add validation if necessary
    }
  
    const employee = availableEmployees.find((emp) => emp._id === employeeId);
    
    // Ensure employee is found and that we have both name and profile picture
    if (!employee) {
      console.error('Employee not found');
      return;
    }
  
    const taskData: ITaskDTO = {
      employeeId,
      employeeName: employee.name, // Send employee name
      employeeProfilePicture: employee.profilePicture, // Send employee profile picture
      dueDate: dueDate.toDate(),
      tasks,
    };
  
    try {
      // Send the data to the backend via POST request
      const response = await employeeInstance.post('/employee/api/task/assign-task-to-employee', taskData);
      console.log('Tasks assigned successfully:', response.data);
      
      // Show success notification
      notification.success({
        message: 'Tasks Assigned Successfully',
        description: 'The tasks have been assigned to the selected employee.',
      });
  
      // Call the onSave callback with the task data after successful save
      onSave(taskData);
  
      // Close the modal after successful save
      onCancel();
  
    } catch (error) {
      console.error('Error assigning tasks:', error);
  
      // Show error notification
      notification.error({
        message: 'Error Assigning Tasks',
        description: 'There was an error assigning the tasks. Please try again.',
      });
    }
  };
  

  return (
    <Modal
      title="Assign Multiple Tasks"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      style={{ maxWidth: '800px', width: '90%' }}
    >
      <Select
        placeholder="Select Employee"
        value={employeeId}
        onChange={(value) => {
          console.log("Selected employee ID:", value); // Log selected employee ID for debugging
          setEmployeeId(value);
        }}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        {availableEmployees.map((employee) => (
          <Select.Option key={employee._id} value={employee._id}>
            {employee.name}
          </Select.Option>
        ))}
      </Select>

      <DatePicker
        placeholder="Due Date"
        value={dueDate}
        onChange={(date) => setDueDate(date)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <Divider>Tasks</Divider>
      {tasks.map((task, index) => (
        <Row key={index} gutter={16} style={{ marginBottom: '1rem' }}>
          <Col span={6}>
            <Input
              placeholder="Task Title"
              value={task.title}
              onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder="Description"
              value={task.description}
              onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Priority"
              value={task.priority}
              onChange={(value) => handleTaskChange(index, 'priority', value)}
            >
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Col>
          <Col span={3}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeTask(index)}
              disabled={tasks.length === 1} // Prevent deleting the last task
            />
          </Col>
        </Row>
      ))}
      <Button type="dashed" onClick={addTask} icon={<PlusOutlined />} style={{ width: '100%' }}>
        Add Task
      </Button>
    </Modal>
  );
};

export default TaskModal;

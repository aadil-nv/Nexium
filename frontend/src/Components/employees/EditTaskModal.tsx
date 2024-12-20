import React, { useEffect, useState } from 'react';
import { Modal, Input, DatePicker, Button, Select, Row, Col } from 'antd';
import moment from 'moment';
import { employeeInstance } from '../../services/employeeInstance'; // Ensure this is correctly imported
import { toast } from 'react-toastify'; // Ensure React-Toastify is imported

interface ITaskDTO {
  employeeId: string;
  dueDate: Date;
  tasks: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high'; // Priority field limited to these options
  }[];
}

interface TaskModalProps {
  visible: boolean;
  selectedTask: any | null;
  onCancel: () => void;
  onSave: (task: any) => void;
}

const EditTaskModal: React.FC<TaskModalProps> = ({ visible, selectedTask, onCancel, onSave }) => {
  const [taskData, setTaskData] = useState<any | null>(null);

  useEffect(() => {
    if (selectedTask) {
      setTaskData(selectedTask); // Initialize taskData when selectedTask changes
    }
  }, [selectedTask]);

  const handleTaskUpdate = (index: number, field: string, value: any) => {
    if (taskData) {
      const updatedTasks = [...taskData.tasks];

      // Ensure that the 'priority' field can only have valid values
      if (field === 'priority' && (value === 'low' || value === 'medium' || value === 'high')) {
        updatedTasks[index] = { ...updatedTasks[index], [field]: value };
      } else if (field !== 'priority') {
        updatedTasks[index] = { ...updatedTasks[index], [field]: value };
      }

      setTaskData({ ...taskData, tasks: updatedTasks });
    }
  };

  const handleAddTask = () => {
    if (taskData) {
      const newTask = {
        title: '',
        description: '',
        priority: 'low', // Default to 'low' as a valid priority value
      };
      setTaskData({
        ...taskData,
        tasks: [...taskData.tasks, newTask],
      });
    }
  };

  const handleSave = async () => {
    if (taskData) {
      try {
        // Send the updated task data to the backend
        const response = await employeeInstance.post(`/employee/api/task/update-task/${taskData.employeeId}`, taskData);
        
        if (response.status === 200) {
          toast.success('Task updated successfully!'); // Show success message
          onSave(taskData); // Pass updated task data back to parent
        }
      } catch (error) {
        toast.error('Failed to update task!'); // Show error message if API fails
      }
    }
  };

  const renderTasks = () => {
    return taskData?.tasks.map((task, index) => (
      <div key={index} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={24}>
            <Input
              value={task.title}
              onChange={(e) => handleTaskUpdate(index, 'title', e.target.value)}
              placeholder={`Task ${index + 1} Title`}
              style={{ marginBottom: 8 }}
            />
          </Col>
          <Col span={24}>
            <Input
              value={task.description}
              onChange={(e) => handleTaskUpdate(index, 'description', e.target.value)}
              placeholder={`Task ${index + 1} Description`}
              style={{ marginBottom: 8 }}
            />
          </Col>
          <Col span={12}>
            <Select
              value={task.priority}
              onChange={(value) => handleTaskUpdate(index, 'priority', value)}
              style={{ width: '100%' }}
              placeholder="Priority"
            >
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Col>
        </Row>
      </div>
    ));
  };

  return (
    <Modal
      title="Edit Task"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      width={600}
      okText="Save"
      cancelText="Cancel"
    >
      {taskData && (
        <>
          <Input
            value={taskData.employeeId}
            disabled
            placeholder="Employee ID"
            style={{ marginBottom: 10 }}
          />
          <DatePicker
            value={moment(taskData.dueDate)}
            onChange={(date) => setTaskData({ ...taskData, dueDate: date?.toDate() || new Date() })}
            style={{ marginBottom: 16 }}
            placeholder="Due Date"
          />
          {renderTasks()}
          <Button type="dashed" onClick={handleAddTask} style={{ width: '100%', marginTop: 16 }}>
            Add New Task
          </Button>
        </>
      )}
    </Modal>
  );
};

export default EditTaskModal;

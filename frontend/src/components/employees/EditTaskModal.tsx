import React, { useEffect, useState } from 'react';
import { Modal, Input, DatePicker, Button, Select, Row, Col } from 'antd';
import moment from 'moment';
import { employeeInstance } from '../../services/employeeInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

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
  selectedTask: Task | null;
  onCancel: () => void;
  onSave: (task: Task) => void;
}

const taskStatusColors = {
  backlog: '#808080',
  inProgress: '#1890ff',
  codeReview: '#722ed1',
  qaTesting: '#faad14',
  blocked: '#f5222d',
  completed: '#52c41a',
  deployed: '#13c2c2',
  approved: '#389e0d'
};

const EditTaskModal: React.FC<TaskModalProps> = ({ visible, selectedTask, onCancel, onSave }) => {
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [availableEmployees, setAvailableEmployees] = useState<{ _id: string, name: string }[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [isReassigning, setIsReassigning] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTaskData(selectedTask);
      setSelectedEmployeeId(selectedTask.employeeId || '');
    }
  }, [selectedTask]);

  useEffect(() => {
    if (visible) {
      fetchAvailableEmployees();
    }
  }, [visible]);

  const fetchAvailableEmployees = async () => {
    try {
      const response = await employeeInstance.get('/employee-service/api/task/get-employee-without-task');
      if (Array.isArray(response.data)) {
        setAvailableEmployees(response.data);
      }
    }  catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to fetch available employees');
      } else if (error instanceof Error) {
        toast.error(error.message || 'Failed to fetch available employees');
      } else {
        toast.error('Failed to fetch available employees');
      }
    }
  };

  const handleTaskUpdate = (index: number, field: string, value : string) => {
    if (taskData) {
      const updatedTasks = [...taskData.tasks];
      updatedTasks[index] = { ...updatedTasks[index], [field]: value };
      setTaskData({ ...taskData, tasks: updatedTasks });
    }
  };

  const handleAddTask = () => { 
    if (taskData) { 
      const newTask: SubTask = { 
        title: '', 
        description: '', 
        priority: 'low', 
        taskStatus: 'backlog', 
        isCompleted: false,
        _id: undefined,
        response: ''
      }; 
      setTaskData({ 
        ...taskData, 
        tasks: [...taskData.tasks, newTask], 
      }); 
    } 
  };

  const handleDeleteTask = (index: number) => {
    if (taskData) {
      const updatedTasks = taskData.tasks.filter((_, i) => i !== index);
      setTaskData({ ...taskData, tasks: updatedTasks });
    }
  };

  const handleReassign = async () => {
    if (!taskData) {
      toast.error('Task data is missing');
      return;
    }
  
    if (selectedEmployeeId === taskData.employeeId) {
      toast.info('Please select a different employee to reassign');
      return;
    }
  
    try {
      await employeeInstance.patch(`/employee-service/api/task/reassign-task/${taskData._id}`, {
        employeeId: selectedEmployeeId
      });
  
      toast.success('Task reassigned successfully!');
      setIsReassigning(false);
  
      const newEmployee = availableEmployees.find(emp => emp._id === selectedEmployeeId);
      if (newEmployee) {
        const updatedTask = {
          ...taskData,
          employeeId: selectedEmployeeId,
          employeeName: newEmployee.name,
        };
        
        setTaskData(updatedTask);
        onSave(updatedTask);
      } else {
        toast.error('Selected employee not found');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to reassign task');
    }
  };

  const handleSave = async () => {
    if (taskData) {
      try {
        const response = await employeeInstance.post(`/employee-service/api/task/update-task/${taskData._id}`, taskData);
        if (response.status === 200) {
          toast.success('Task updated successfully!');
          onSave(taskData);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || 'Failed to update task!');
        } else if (error instanceof Error) {
          toast.error(error.message || 'Failed to update task!');
        } else {
          toast.error('Failed to update task!');
        }
      }
    }
  };

  const renderTasks = () => {
    return taskData?.tasks.map((task, index) => (
      <div
        key={index}
        style={{
          marginBottom: 24,
          padding: 20,
          borderRadius: 8,
          border: '1px solid #d9d9d9',
          backgroundColor: '#fafafa',
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#666' }}>
                Task Title
              </label>
              <Input
                value={task.title}
                onChange={(e) => handleTaskUpdate(index, 'title', e.target.value)}
                placeholder={`Enter title for task ${index + 1}`}
                style={{ borderRadius: 4 }}
              />
            </div>
          </Col>
          <Col span={24}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#666' }}>
                Description
              </label>
              <Input.TextArea
                value={task.description}
                onChange={(e) => handleTaskUpdate(index, 'description', e.target.value)}
                placeholder={`Enter description for task ${index + 1}`}
                style={{ borderRadius: 4 }}
                rows={3}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#666' }}>
                Priority
              </label>
              <Select
                value={task.priority}
                onChange={(value) => handleTaskUpdate(index, 'priority', value)}
                style={{ width: '100%', borderRadius: 4 }}
              >
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#666' }}>
                Status
              </label>
              <Select
                value={task.taskStatus}
                onChange={(value) => handleTaskUpdate(index, 'taskStatus', value)}
                style={{ width: '100%', borderRadius: 4 }}
              >
                {Object.entries(taskStatusColors).map(([status, color]) => (
                  <Select.Option key={status} value={status}>
                    <span style={{ color }}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Col>
          {task.response && (
            <Col span={24}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', marginBottom: 4, color: '#666' }}>
                  Employee Response
                </label>
                <Input
                  value={task.response}
                  onChange={(e) => handleTaskUpdate(index, 'response', e.target.value)}
                  placeholder={`Enter response for task ${index + 1}`}
                  style={{ borderRadius: 4 }}
                  readOnly
                />
              </div>
            </Col>
          )}
          <Col span={24}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: 16,
                gap: 8,
              }}
            >
              <span
                className="animate-bounce"
                style={{
                  fontSize: 24,
                  color: task.isCompleted ? '#4CAF50' : '#FF4D4F',
                }}
              >
                {task.isCompleted ? '✅' : '❌'}
              </span>
              <span style={{ fontSize: 16, fontWeight: 500 }}>
                {task.isCompleted ? 'Completed' : 'Not Completed'}
              </span>
            </div>
          </Col>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              onClick={() => handleDeleteTask(index)}
              style={{
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                marginTop: 8,
              }}
              type="primary"
              danger
            >
              Delete Task
            </Button>
          </Col>
        </Row>
      </div>
    ));
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Edit Task</div>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      width={800}
      okText="Save Changes"
      cancelText="Cancel"
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px', marginBottom: 20 }}
    >
      {taskData && (
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, color: '#666' }}>Employee</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {isReassigning ? (
                    <Select
                      style={{ width: '100%' }}
                      value={selectedEmployeeId}
                      onChange={setSelectedEmployeeId}
                      placeholder="Select new employee"
                    >
                      <Select.Option value={taskData.employeeId || ''}>
                        {taskData.employeeName} (Current)
                      </Select.Option>
                      {availableEmployees.map(emp => (
                        <Select.Option key={emp._id} value={emp._id}>
                          {emp.name}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      value={taskData.employeeName}
                      disabled
                      style={{ backgroundColor: '#f5f5f5', borderRadius: 4, flex: 1 }}
                    />
                  )}
                  <Button
                    type={isReassigning ? "primary" : "default"}
                    onClick={() => {
                      if (isReassigning) {
                        handleReassign();
                      } else {
                        setIsReassigning(true);
                      }
                    }}
                  >
                    {isReassigning ? "Confirm" : "Reassign"}
                  </Button>
                  {isReassigning && (
                    <Button onClick={() => setIsReassigning(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, color: '#666' }}>Task Name</label>
                <Input
                  value={taskData.taskName}
                  disabled
                  style={{ backgroundColor: '#f5f5f5', borderRadius: 4 }}
                />
              </div>
            </Col>
            <Col span={24}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 4, color: '#666' }}>Due Date</label>
                <DatePicker
                  value={moment(taskData.dueDate)}
                  onChange={(date) => setTaskData({ ...taskData, dueDate: date?.format('YYYY-MM-DD') || '' })}
                  style={{ width: '100%', borderRadius: 4 }}
                />
              </div>
            </Col>
          </Row>
          
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8, marginBottom: 16 }}>
              Task Items
            </h3>
            {renderTasks()}
          </div>
          
          <Button
            type="dashed"
            onClick={handleAddTask}
            style={{
              width: '100%',
              height: 40,
              borderRadius: 4
            }}
          >
            + Add New Task
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default EditTaskModal;
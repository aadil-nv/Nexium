import React, { useState, useEffect } from 'react';
import { Button, Table, message } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import TaskModal from './TaskModal';
import EditTaskModal from './EditTaskModal';
import { employeeInstance } from '../../services/employeeInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, addTask, updateTask, removeTask } from '../../redux/slices/taskSlice';
import { RootState } from '../../redux/store/store';

interface Task {
  _id: string;
  employeeProfilePicture: string;
  employeeName: string;
  dueDate: string;
  tasks: { title: string; priority: string; description: string; isCompleted: boolean, _id: string}[];
}

const Task: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [taskModalVisible, setTaskModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.task.tasks); // Access tasks from Redux state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await employeeInstance.get('/employee/api/task/get-all-tasks');
        dispatch(setTasks(response.data)); // Dispatch setTasks with the fetched data
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleAddTask = (task: any) => {
    dispatch(addTask(task)); // Dispatch addTask action with new task
  };

  const handleSaveTaskChanges = (updatedTask: any) => {
    dispatch(updateTask(updatedTask)); // Dispatch updateTask action with the updated task
    setTaskModalVisible(false);
  };

  const handleRemoveTask = async (taskId: string) => {
    console.log('taskId to remove ', taskId);

    try {
      // Send DELETE request with taskId as a URL parameter
      const response = await employeeInstance.delete(`/employee/api/task/delete-task/${taskId}`);
      if (response.status === 200) {
        dispatch(removeTask(taskId)); // Dispatch removeTask action with the taskId
        message.success('Task removed successfully!');
      }
    } catch (error) {
      console.error('Error removing task:', error);
      message.error('Failed to remove task.');
    }
  };

  const columns:any = [
    {
      title: 'Profile Picture',
      dataIndex: 'employeeProfilePicture',
      key: 'employeeProfilePicture',
      align: 'center',
      render: (profilePicture: string) => (
        <img
          src={profilePicture || 'https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png'} // Default image
          alt="Employee Profile"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ),
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      align: 'center',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      align: 'center',
      render: (dueDate: string) => new Date(dueDate).toLocaleDateString(),
    },
    {
      title: 'Tasks',
      key: 'tasks',
      align: 'center',
      render: (_: unknown, record: any) => (
        <div>
          {record.tasks.map((task: any, index: number) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <strong>{task.title}</strong> ({task.priority || 'low'})<br />
              {task.description}<br />
              Completed: {task.isCompleted ? 'Yes' : 'No'}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_: unknown, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ width: 120 }}
            onClick={() => {
              setSelectedTask(record);  // Make sure to pass the full task record
              setTaskModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            style={{
              width: 120,
              backgroundColor: 'red',
              color: 'white',
            }}
            onClick={() => handleRemoveTask(record._id)} // Ensure correct task ID is passed
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#4A90E2' }}
      >
        Task Management
      </motion.div>

      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ position: 'absolute', top: 20, right: 20 }}
        icon={<PlusCircleOutlined />}
      >
        Assign New Task
      </Button>

      <Table columns={columns} dataSource={tasks} rowKey="_id" style={{ marginTop: 50 }} />

      <TaskModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleAddTask}
      />

      <EditTaskModal
        visible={taskModalVisible}
        selectedTask={selectedTask}
        onCancel={() => setTaskModalVisible(false)}
        onSave={handleSaveTaskChanges}
      />
    </div>
  );
};

export default Task;

import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import TaskModal from './TaskModal';
import EditTaskModal from './EditTaskModal';
import { employeeInstance } from '../../services/employeeInstance';  // Make sure the correct API instance is imported
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, addTask, updateTask, removeTask } from '../../redux/slices/taskSlice'; // Import actions
import { RootState } from '../../redux/store/store';

const Task: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [taskModalVisible, setTaskModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null); // Modify according to your task data type
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

  console.log("tasks$$$$$$$$$$$$$$$$$$",tasks);
  

  const handleAddTask = (task: any) => {
    dispatch(addTask(task)); // Dispatch addTask action with new task
  };

  const handleSaveTaskChanges = (updatedTask: any) => {
    dispatch(updateTask(updatedTask)); // Dispatch updateTask action with the updated task
    setTaskModalVisible(false);
  };

  const handleRemoveTask = (employeeId: string) => {
    dispatch(removeTask(employeeId)); // Dispatch removeTask action with the employeeId
  };

  const columns = [
    {
      title: 'Profile Picture',
      dataIndex: 'employeeProfilePicture',
      key: 'employeeProfilePicture',
      align: 'center' as 'center',
      render: (profilePicture: string) => (
        
        <img
          src={profilePicture }  // Path to default image
          alt="Employee Profile"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ),
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      align: 'center' as 'center',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      align: 'center' as 'center',
      render: (dueDate: Date) => new Date(dueDate).toLocaleDateString(),
    },
    {
      title: 'Tasks',
      key: 'tasks',
      align: 'center' as 'center',
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
      align: 'center' as 'center',
      render: (_: unknown, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ width: 120 }}
            onClick={() => {
              setSelectedTask(record);
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
            onClick={() => handleRemoveTask(record.employeeId)}
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

      <Table columns={columns} dataSource={tasks} rowKey="employeeId" style={{ marginTop: 50 }} />

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

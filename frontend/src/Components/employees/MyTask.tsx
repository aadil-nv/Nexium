import React, { useEffect, useState } from 'react';
import { Input, Button, List, Checkbox, Tag, Typography } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined, FireOutlined, ClockCircleOutlined, CheckCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeInstance } from '../../services/employeeInstance';
import { toast } from 'react-toastify';

const { Text } = Typography;

const TodoList = () => {
  const [todos, setTodos] = useState<any>({ tasks: [] });
  const [newTodo, setNewTodo] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await employeeInstance.get('/employee/api/task/get-tasks-by-employee');
        setTodos(data);
      } catch {
        toast.error('Failed to fetch tasks!');
      }
    };
    fetchTasks();
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos(prev => ({ ...prev, tasks: [...prev.tasks, { _id: Date.now().toString(), title: newTodo, description: 'New task description', isCompleted: false, priority: 'low' }] }));
    setNewTodo('');
  };

  const toggleComplete = async (id: string) => {
    const updatedTasks = todos.tasks.map(task =>
      task._id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTodos({ ...todos, tasks: updatedTasks });

    const taskToUpdate = updatedTasks.find((task: any) => task._id === id);
    if (taskToUpdate) {
      try {
        await employeeInstance.post('/employee/api/task/update-task-completion', { ...taskToUpdate, taskId: id });
        toast.success('Task updated successfully!');
      } catch {
        toast.error('Failed to update task!');
      }
    }
  };

  const getPriority = (priority: string) => ({
    low: { color: 'blue', icon: <ClockCircleOutlined /> },
    medium: { color: 'orange', icon: <CheckCircleOutlined /> },
    high: { color: 'red', icon: <FireOutlined /> },
  }[priority] || { color: 'gray', icon: <CheckCircleOutlined /> });

  const calculateDaysLeft = (dueDate: string) => {
    const timeDiff = new Date(dueDate).getTime() - new Date().getTime();
    return timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
            <div><h1 className="text-2xl font-bold text-gray-800">Daily Tasks</h1><div>Given Date: <span className="font-medium text-red-600">{todos.dueDate || 'Not Set'}</span></div></div>
          </div>

          <div className="divide-y divide-gray-200">
            <List itemLayout="horizontal" dataSource={todos.tasks} renderItem={(task: any) => (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <List.Item className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4 ml-4">
                    <Checkbox checked={task.isCompleted} onChange={() => toggleComplete(task._id)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Text delete={task.isCompleted} className={`text-base ${task.isCompleted ? 'text-gray-400' : 'text-gray-700'}`}>
                          <strong className="text-red-600">Task:</strong> {task.title}
                        </Text>
                        <Tag color={getPriority(task.priority).color} icon={getPriority(task.priority).icon} className="ml-2">{task.priority}</Tag>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        <div><strong>Description:</strong> {task.description}</div>
                        <div><strong>Days Left:</strong> {task.dueDate ? calculateDaysLeft(task.dueDate) : 'N/A'} days</div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              </motion.div>
            )} />
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
            <p className="text-sm text-gray-600">Total tasks: <span className="font-medium">{todos.tasks.length}</span> | Completed: <span className="font-medium text-green-600">{todos.tasks.filter((t: any) => t.isCompleted).length}</span> | Remaining: <span className="font-medium text-blue-600">{todos.tasks.filter((t: any) => !t.isCompleted).length}</span></p>
          </div>
        </motion.div>

        <motion.div className="fixed bottom-8 right-8" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button type="primary" shape="circle" size="large" icon={isInputVisible ? <CloseCircleOutlined /> : <PlusCircleOutlined />} onClick={() => setIsInputVisible(!isInputVisible)} className="shadow-lg h-14 w-14" />
        </motion.div>
      </div>
    </div>
  );
};

export default TodoList;

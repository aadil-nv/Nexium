import  { useEffect, useState } from 'react';
import { Input, Button, List, Checkbox, Tag, Typography, Select } from 'antd';
import {
  PlusCircleOutlined,
  CloseCircleOutlined,
  FireOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { employeeInstance } from '../../services/employeeInstance';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const { Text } = Typography;
const { Option } = Select;

interface SubTask {
  title: string;
  priority: string;
  description: string;
  isCompleted: boolean;
  _id: string;
  taskStatus?: string;
  response?: string;
  assignedDate?: string;
}

interface TodoState {
  tasks: SubTask[];
  taskName?: string;
  assignedDate?: string;
  dueDate?: string;
  assignedBy?: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoState>({ tasks: [] });
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await employeeInstance.get(`/employee-service/api/task/get-tasks-by-employee/${id}`);
        setTodos(data);
      } catch {
        toast.error('Failed to fetch tasks!');
      }
    };
    fetchTasks();
  }, [id]);

  const toggleComplete = async (taskId: string) => {
    const updatedTasks = todos.tasks.map((task) =>
      task._id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTodos({ ...todos, tasks: updatedTasks });

    const taskToUpdate = updatedTasks.find((task) => task._id === taskId);
    if (taskToUpdate) {
      try {
        await employeeInstance.post('/employee-service/api/task/update-task-completion', {
          ...taskToUpdate,
          taskId,
        });
        toast.success('Task updated successfully!');
      } catch {
        toast.error('Failed to update task!');
      }
    }
  };

  const updateResponse = (taskId: string, response: string) => {
    setResponses((prev) => ({ ...prev, [taskId]: response }));
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<SubTask>) => {
    const updatedTasks = todos.tasks.map((task) =>
      task._id === taskId
        ? {
            ...task,
            taskStatus: updatedTask.taskStatus,
            isCompleted: updatedTask.isCompleted !== undefined ? updatedTask.isCompleted : task.isCompleted,
          }
        : task
    );

    setTodos({ ...todos, tasks: updatedTasks });

    try {
      const payload = {
        taskId,
        taskStatus: updatedTask.taskStatus,
        isCompleted: updatedTask.isCompleted !== undefined ? updatedTask.isCompleted : false,
        response: updatedTask.response || '',
        _id: taskId,
      };

      await employeeInstance.post(`/employee-service/api/task/update-completed-task/${id}`, payload);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task!');
    }
  };

  const getPriority = (priority: string) =>
    ({
      low: { color: 'blue', icon: <ClockCircleOutlined /> },
      medium: { color: 'orange', icon: <CheckCircleOutlined /> },
      high: { color: 'red', icon: <FireOutlined /> },
    }[priority] || { color: 'gray', icon: <CheckCircleOutlined /> });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Task: {todos.taskName}</h1>
              <div className="mt-2 space-y-1">
                <span className="block font-medium text-red-600">Date of Assigning: {todos.assignedDate || 'Not Set'}</span>
                <span className="block font-medium text-red-600">Due Date: {todos.dueDate || 'Not Set'}</span>
                <span className="block font-medium text-red-600">Assigned By: {todos.assignedBy || 'Not Set'}</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            <List
              itemLayout="vertical"
              dataSource={todos.tasks}
              renderItem={(task: SubTask) => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <List.Item className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4 p-3 border-l-4 border-blue-500 bg-gray-50 rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out">
                        <Checkbox
                          checked={task.isCompleted}
                          onChange={() => toggleComplete(task._id)}
                          className="text-blue-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-2">
                            <Text
                              delete={task.isCompleted}
                              className={`text-lg font-semibold ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                            >
                              {task.title}
                            </Text>
                            <Tag
                              color={getPriority(task.priority).color}
                              icon={getPriority(task.priority).icon}
                              className="text-xs"
                            >
                              {task.priority}
                            </Tag>
                          </div>
                          <div className="text-xs text-gray-700 space-y-1 mb-3">
                            <div>
                              <strong className="font-medium">Sub Task:</strong> {task.title}
                            </div>
                            <div>
                              <strong className="font-medium">Description:</strong> {task.description}
                            </div>
                            <div>
                              <strong className="font-medium">Assigned Date:</strong> {task.assignedDate}
                            </div>
                            <div>
                              <strong className="font-medium">SubTask status:</strong>
                              <Tag color={task.taskStatus === 'completed' ? 'green' : 'orange'}>{task.taskStatus}</Tag>
                            </div>
                          </div>

                          {/* Status Change Select */}
                          <div className="mb-3">
                            <Select
                              value={task.taskStatus}
                              onChange={(value) => handleUpdateTask(task._id, { taskStatus: value })}
                              className="w-40"
                              placeholder={task.taskStatus}
                            >
                              <Option value="backlog">Backlog</Option>
                              <Option value="inProgress">In Progress</Option>
                              <Option value="codeReview">Code Review</Option>
                              <Option value="qaTesting">QA Testing</Option>
                              <Option value="completed">Completed</Option>
                              <Option value="deployed">Deployed</Option>
                            </Select>
                          </div>

                          {/* Response Section */}
                          <div className="flex items-center gap-4">
                            <Input
                              placeholder={task.response ? task.response : 'Enter your response'} 
                              value={responses[task._id] || ''}
                              onChange={(e) => updateResponse(task._id, e.target.value)}
                              className="flex-1 p-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                              type="primary"
                              icon={<SaveOutlined />}
                              onClick={() =>
                                handleUpdateTask(task._id, {
                                  taskStatus: task.taskStatus,
                                  isCompleted: task.isCompleted,
                                  response: responses[task._id],
                                })
                              }
                              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                </motion.div>
              )}
            />
          </div>
        </motion.div>

        <motion.div className="fixed bottom-8 right-8" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={isInputVisible ? <CloseCircleOutlined /> : <PlusCircleOutlined />}
            onClick={() => setIsInputVisible(!isInputVisible)}
            className="shadow-lg h-14 w-14"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TodoList;
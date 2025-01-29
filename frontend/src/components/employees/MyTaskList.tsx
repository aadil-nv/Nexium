import React, { useState, useEffect } from 'react';
import { Input, Select, Tag, Pagination, Button } from 'antd';
import { motion } from 'framer-motion';
import { CheckCircleOutlined, CloseCircleOutlined, CalendarOutlined, UserOutlined, SearchOutlined, FilterOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, setLoading } from '../../redux/slices/taskList';
import { employeeInstance } from '../../services/employeeInstance';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store/store';

const { Option } = Select;

interface SubTask {
  isCompleted: boolean;
}

interface Task {
  _id: string;
  taskName: string;
  dueDate: string;
  assignedBy: string;
  isApproved: boolean;
  status?: string;
  tasks: SubTask[];
}

const MyTaskList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.taskList.tasks as Task[]);
  const loading = useSelector((state: RootState) => state.taskList.loading);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        const response = await employeeInstance.get('/employee-service/api/task/employee-tasklist');
        console.log('response.data', response.data);
        
        dispatch(setTasks(response.data)); // Populate Redux state with fetched tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTasks();
  }, [dispatch]);

  const filteredTasks = tasks.filter((task: Task) =>
    task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!statusFilter || task.status === statusFilter)
  );

  const displayedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const TaskCard = ({ task }: { task: Task }) => {
    // Calculate completed tasks count
    const completedCount = task.tasks.filter((subTask: SubTask) => subTask.isCompleted).length;
    const totalCount = task.tasks.length;
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div
          className={`p-6 ${
            task.isApproved ? 'bg-gradient-to-r from-green-50 to-blue-50' : 'bg-gradient-to-r from-yellow-50 to-red-50'
          }`}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Task Name: {task.taskName}</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <CalendarOutlined className="mr-2" />
              <span className="text-sm">Due: {task.dueDate.split('T')[0]}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <UserOutlined className="mr-2" />
              <span className="text-sm">Assigned By: {task.assignedBy}</span>
            </div>
            <div className="flex items-center justify-between">
              <Tag color="blue">Approved</Tag>
              <Tag color={task.isApproved === true ? 'green' : 'orange'}>
                {task.isApproved ? 'Yes' : 'No'}
              </Tag>
              {task.isApproved ? (
                <CheckCircleOutlined className="text-green-500 text-xl" />
              ) : (
                <CloseCircleOutlined className="text-red-500 text-xl" />
              )}
            </div>
            <div className="text-gray-600 mt-2">
              <span>Tasks Completed: {completedCount}/{totalCount}</span>
            </div>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate(`/employee/task/${task._id}`)} // Navigate to MyTask page
            >
              View Details
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Management</h1>

          <div className="flex flex-wrap gap-4">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px]"
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by Status"
              className="w-48"
              suffixIcon={<FilterOutlined />}
            >
              <Option value="">All Status</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTasks.map((task: Task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                total={filteredTasks.length}
                pageSize={tasksPerPage}
                onChange={setCurrentPage}
                showSizeChanger={false}
                className="bg-white px-4 py-2 rounded-lg shadow-md"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyTaskList;
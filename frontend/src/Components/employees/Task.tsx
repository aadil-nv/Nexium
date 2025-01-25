import React, { useState, useEffect } from 'react';
import { Button, Table, message, Input, Select } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import TaskModal from './TaskModal';
import EditTaskModal from './EditTaskModal';
import { employeeInstance } from '../../services/employeeInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, addTask, updateTask, removeTask } from '../../redux/slices/taskSlice';
import { RootState } from '../../redux/store/store';
import { Progress } from 'antd';
import { ColumnsType } from 'antd/lib/table';

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

const Task: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [taskModalVisible, setTaskModalVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.task.tasks);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        dispatch(setTasks([]));
        const response = await employeeInstance.get('/employee-service/api/task/get-all-tasks');
        dispatch(setTasks(response.data));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleAddTask = (task: Task) => {
    dispatch(addTask(task));
  };

  const handleSaveTaskChanges = (updatedTask: Task) => {
    dispatch(updateTask(updatedTask));
    setTaskModalVisible(false);
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      const response = await employeeInstance.delete(`/employee-service/api/task/delete-task/${taskId}`);
      if (response.status === 200) {
        dispatch(removeTask(taskId));
        message.success('Task removed successfully!');
      }
    } catch (error) {
      console.error('Error removing task:', error);
      message.error('Failed to remove task.');
    }
  };

  const handleApproval = async (taskId: string, currentApprovalStatus?: boolean) => {
    const newApprovalStatus = currentApprovalStatus === true ? false : true;
    
    try {
      const response = await employeeInstance.patch(`/employee-service/api/task/update-taskapproval/${taskId}`, {
        isApproved: newApprovalStatus,
      });
  
      if (response.status === 200) {
        dispatch(updateTask({
          ...response.data,
        }));
        message.success(newApprovalStatus ? 'Task approved!' : 'Task approval pending!');
      } else {
        message.error('Failed to update approval status.');
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
      message.error('Failed to update approval status.');
    }
  };

  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch = 
      task.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      task.tasks.some((t: SubTask) => t.title.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesPriority = filterPriority ? 
      task.tasks.some((t: SubTask) => t.priority.toLowerCase() === filterPriority.toLowerCase()) : 
      true;
    
    return matchesSearch && matchesPriority;
  });

  const columns: ColumnsType<Task> = [
    {
      title: 'Employee',
      key: 'employee',
      align: 'center',
      render: (record: Task) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <img
            src={record.employeeProfilePicture || 'https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png'}
            alt="Employee Profile"
            style={{ width: 40, height: 40, borderRadius: '50%' }}
          />
          <span>{record.employeeName}</span>
        </div>
      ),
    },
    {
      title: 'Task Name',
      key: 'taskName',
      align: 'center',
      render: (record: Task) => (
        <span>
          {record.taskName}
        </span>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      align: 'center',
      render: (dueDate: string) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(new Date(dueDate));
        return formattedDate;
      },
    },
    {
      title: 'Tasks',
      key: 'tasks',
      align: 'center',
      render: (_: unknown, record: Task) => {
        const totalTasks = record.tasks.length;
        const completedTasks = record.tasks.filter((task: SubTask) => task.isCompleted).length;
        const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const isCompleted = totalTasks === completedTasks
    
        return (
          <div>
            <div style={{ marginTop: 8 }}>
              <Progress
                percent={Math.round(completionPercentage)}
                status={completionPercentage === 100 ? 'success' : 'active'}
              />
              <span style={{ marginTop: 4 }}>{`Completed ${completedTasks} of ${totalTasks} tasks`}</span>
            </div>
    
            {isCompleted && (
              <div style={{ marginTop: '10px' }}>
                {record.isApproved ? (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleApproval(record._id!, record.isApproved)}
                    style={{ width: 120, backgroundColor: 'red', borderColor: 'red' }}
                  >
                    Reject
                  </Button>
                ) : (
                  <Button
                    type="default"
                    icon={<ClockCircleOutlined />}
                    onClick={() => handleApproval(record._id!, record.isApproved)}
                    style={{ width: 120, backgroundColor: 'orange', borderColor: 'orange' }}
                  >
                    Approve
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center',
      render: (_: unknown, record: Task) => {
        const isOverdue = new Date(record.dueDate) < new Date();
        const isApproved = record.isApproved;
        const totalTasks = record.tasks.length;
        const completedTasks = record.tasks.filter((task: SubTask) => task.isCompleted).length;
    
        const getStatus = () => {
          if (isOverdue && isApproved && completedTasks === totalTasks) {
            return { status: 'Task Completed', icon: '✅' };
          }
          if (!isOverdue && !isApproved && completedTasks === totalTasks) {
            return { status: 'Not Approved', icon: '❌' };
          }
          if (!isOverdue && !isApproved && completedTasks !== totalTasks) {
            return { status: 'Progressing', icon: '🔄' };
          }
          if (isOverdue && !isApproved && completedTasks !== totalTasks) {
            return { status: 'Task Due', icon: '⏰' };
          }
          if (isOverdue && !isApproved && completedTasks === totalTasks) {
            return { status: 'Not Approved', icon: '❌' };
          }
          if(isApproved && completedTasks=== totalTasks){
            return { status: 'Task Completed', icon: '✅' };
          }
          return { status: 'Unknown Status', icon: '❓' };
        };
    
        const { status, icon } = getStatus();
    
        return (
          <div className="flex items-center gap-2">
            <span className="animate-bounce">{icon}</span>
            <span>{status}</span>
          </div>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_: unknown, record: Task) => (
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
            onClick={() => handleRemoveTask(record._id!)}
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

      <div style={{ marginTop: 50, marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="Search by employee name or task title"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Filter by priority"
          style={{ width: 200 }}
          value={filterPriority}
          onChange={value => setFilterPriority(value)}
          allowClear
        >
          <Select.Option value="high">High</Select.Option>
          <Select.Option value="medium">Medium</Select.Option>
          <Select.Option value="low">Low</Select.Option>
        </Select>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredTasks}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredTasks.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          },
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
      />

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
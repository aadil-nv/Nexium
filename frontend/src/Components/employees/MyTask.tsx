import React, { useState } from 'react';
import { Input, Button, List, Checkbox, Tag, Typography } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined, FireOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Text } = Typography;

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project proposal', completed: false, priority: 'high', DueDate: '2023-12-31', description: "Complete project proposal" },
    { id: 2, text: 'Review code changes', completed: false, priority: 'medium', DueDate: '2023-12-31', description: "Review code for changes" },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false, priority: 'medium', DueDate: '2023-12-31', description: newTodo }]);
    setNewTodo('');
  };

  const toggleComplete = (id) => setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));

  const getPriority = (priority) => ({
    low: { color: 'blue', icon: <ClockCircleOutlined /> },
    medium: { color: 'orange', icon: <CheckCircleOutlined /> },
    high: { color: 'red', icon: <FireOutlined /> }
  })[priority];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="bg-white rounded-xl shadow-lg overflow-hidden" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
  <div>
    <h1 className="text-2xl font-bold text-gray-800">Daily Tasks</h1>
  </div>
  <div className="text-sm text-gray-600">
    <div>Given Date: <span className="font-medium text-red-600">{new Date().toDateString()}</span></div>
    <div>Time on task : <span className="font-medium text-blue-600">4Days</span></div>
  </div>
</div>
          <AnimatePresence>
            {isInputVisible && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    <Input placeholder="What needs to be done?" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onPressEnter={addTodo} size="large" autoFocus className="flex-1" />
                    <Button type="primary" onClick={addTodo} size="large">Add Task</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="divide-y divide-gray-200">
            <List
              className="todo-list"
              itemLayout="horizontal"
              dataSource={todos}
              renderItem={todo => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <List.Item className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center w-full gap-4 ml-4">
                      <Checkbox checked={todo.completed} onChange={() => toggleComplete(todo.id)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Text delete={todo.completed} className={`text-base ${todo.completed ? 'text-gray-400' : 'text-gray-700'}`}>{todo.text}</Text>
                          <Tag color={getPriority(todo.priority).color} icon={getPriority(todo.priority).icon} className="ml-2">{todo.priority}</Tag>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          <div><strong>Due Date:</strong> {todo.DueDate}</div>
                          <div><strong>Description:</strong> {todo.description}</div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                </motion.div>
              )}
            />
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total tasks: <span className="font-medium">{todos.length}</span> | 
              Completed: <span className="font-medium text-green-600">{todos.filter(t => t.completed).length}</span> | 
              Remaining: <span className="font-medium text-blue-600">{todos.filter(t => !t.completed).length}</span>
            </p>
          </div>
        </motion.div>

        <motion.div className="fixed bottom-8 right-8" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button type="primary" shape="circle" size="large" icon={isInputVisible ? <CloseCircleOutlined /> : <PlusCircleOutlined />} onClick={() => setIsInputVisible(!isInputVisible)} className="shadow-lg h-14 w-14 flex items-center justify-center" />
        </motion.div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Radio, Input, Button, Card, List, Drawer, message } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { employeeInstance } from '../../services/employeeInstance';

const { RangePicker } = DatePicker;
const { Search } = Input;

interface LeaveType {
  type: string;
  available: number;
}

interface LeaveData {
  leaveId: string;
  employeeId: string;
  leaveType: string;
  reason: string;
  startDate: string;
  endDate: string;
  duration: number;
  message: string;
  success: boolean;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  isFirstHalf: boolean;
  isSecondHalf: boolean;
}

interface AppliedLeave {
  leaveType: string;
  fromDate: string;
  toDate: string;
  duration: number;
  reason: string;
  dayType: 'full' | 'half';
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  rejectionReason?: string;
  leaveId: string;
  employeeId: string;
  isFirstHalf: boolean;
  isSecondHalf: boolean;
}

interface LeaveFormValues {
  leaveTypes: string;
  dates: [Dayjs, Dayjs];
  dayType: 'full' | 'half';
  halfDayType: 'first' | 'second';
  reason: string;
}

const EmployeeLeave: React.FC = () => {
  const [form] = Form.useForm<LeaveFormValues>();
  const [leaves, setLeaves] = useState<AppliedLeave[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<AppliedLeave[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [currentLeave, setCurrentLeave] = useState<AppliedLeave | null>(null);
  const [showHalfDayOptions, setShowHalfDayOptions] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [typesRes, leavesRes] = await Promise.all([
        employeeInstance.get<Record<string, number>>("/employee-service/api/attendance/get-approved-leaves"),
        employeeInstance.get<LeaveData[]>("/employee-service/api/leave/get-applied-leaves")
      ]);

      const types: LeaveType[] = Object.entries(typesRes.data).map(([type, available]) => ({ 
        type, 
        available: Number(available) 
      }));
      setLeaveTypes(types);

      const formattedLeaves: AppliedLeave[] = leavesRes.data.map((leave) => ({
        leaveType: leave.leaveType,
        fromDate: dayjs(leave.startDate).format('YYYY-MM-DD'),
        toDate: dayjs(leave.endDate).format('YYYY-MM-DD'),
        duration: leave.duration,
        reason: leave.reason,
        dayType: leave.duration >= 1 ? 'full' : 'half',
        status: leave.status,
        appliedAt: dayjs(leave.appliedAt).format('YYYY-MM-DD'),
        rejectionReason: '',
        leaveId: leave.leaveId,
        employeeId: leave.employeeId,
        isFirstHalf: leave.isFirstHalf,
        isSecondHalf: leave.isSecondHalf
      }));
      setLeaves(formattedLeaves);
      setFilteredLeaves(formattedLeaves);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterLeaves = () => {
    let filtered = [...leaves];

    if (searchText) {
      filtered = filtered.filter(leave => 
        leave.reason.toLowerCase().includes(searchText.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(leave => leave.leaveType === selectedType);
    }

    setFilteredLeaves(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterLeaves();
  }, [searchText, selectedType, leaves]);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      if (dates[0].isSame(dates[1], 'day')) {
        setSelectedDays(1);
        // For single day, allow both full and half day options
        const currentDayType = form.getFieldValue('dayType');
        if (currentDayType === 'half') {
          setShowHalfDayOptions(true);
        }
      } else {
        let duration = 0;
        let currentDate = dates[0];
    
        while (currentDate.isBefore(dates[1], 'day') || currentDate.isSame(dates[1], 'day')) {
          if (currentDate.day() !== 0) {
            duration++;
          }
          currentDate = currentDate.add(1, 'day');
        }
    
        setSelectedDays(duration);
        form.setFieldValue('dayType', 'full');
        setShowHalfDayOptions(false);
      }
  
      const selectedLeaveType = form.getFieldValue('leaveTypes');
      const leaveType = leaveTypes.find((type) => type.type === selectedLeaveType);
  
      if (leaveType && selectedDays > leaveType.available) {
        form.setFields([
          {
            name: 'dates',
            errors: ['Duration exceeds available leave days.'],
          },
        ]);
      } else {
        form.setFields([{ name: 'dates', errors: [] }]);
      }
    } else {
      setSelectedDays(0);
      setShowHalfDayOptions(false);
      form.setFields([{ name: 'dates', errors: [] }]);
    }
  };

  const handleDayTypeChange = (e: RadioChangeEvent) => {
    const newDayType = e.target.value as 'full' | 'half';
    form.setFieldValue('dayType', newDayType);
    
    if (newDayType === 'half' && selectedDays === 1) {
      setShowHalfDayOptions(true);
      // Set default half day type if not already set
      if (!form.getFieldValue('halfDayType')) {
        form.setFieldValue('halfDayType', 'first');
      }
    } else {
      setShowHalfDayOptions(false);
      form.setFieldValue('halfDayType', undefined);
    }
  };

  const handleEditClick = (leave: AppliedLeave) => {
    setCurrentLeave(leave);
    
    const dates = [dayjs(leave.fromDate), dayjs(leave.toDate)];
    const isHalfDay = leave.duration < 1;
    
    form.setFieldsValue({
      leaveTypes: leave.leaveType,
      dates: dates,
      dayType: isHalfDay ? 'half' : 'full',
      halfDayType: isHalfDay ? (leave.isFirstHalf ? 'first' : 'second') : undefined,
      reason: leave.reason,
    });
    
    if (dates[0].isSame(dates[1], 'day')) {
      setSelectedDays(1);
      setShowHalfDayOptions(isHalfDay);
    } else {
      let duration = 0;
      let currentDate = dates[0];
      while (currentDate.isBefore(dates[1], 'day') || currentDate.isSame(dates[1], 'day')) {
        if (currentDate.day() !== 0) {
          duration++;
        }
        currentDate = currentDate.add(1, 'day');
      }
      setSelectedDays(duration);
      setShowHalfDayOptions(false);
    }
    
    setDrawerVisible(true);
  };

  const onFinish = async (values: LeaveFormValues) => {
    try {
      const selectedLeaveType = leaveTypes.find(type => type.type === values.leaveTypes);
      const calculatedDuration = values.dayType === 'half' ? 0.5 : selectedDays;
      
      if (calculatedDuration > (selectedLeaveType?.available || 0)) {
        form.setFields([
          {
            name: 'dates',
            errors: [`You don't have enough available leave for this duration.`],
          },
        ]);
        return;
      }
  
      const newLeave = {
        leaveType: values.leaveTypes,
        fromDate: values.dates[0].format('YYYY-MM-DD'),
        toDate: values.dates[1].format('YYYY-MM-DD'),
        duration: calculatedDuration,
        dayType: values.dayType,
        reason: values.reason,
        isFirstHalf: values.dayType === 'half' ? values.halfDayType === 'first' : false,
        isSecondHalf: values.dayType === 'half' ? values.halfDayType === 'second' : false
      };
  
      if (currentLeave) {
        const  response = await employeeInstance.post(`/employee-service/api/leave/update-applied-leave/${currentLeave.leaveId}`, newLeave);
        if(response.data.success == false ){
          message.error(response.data.message);
          console.log('response.data', response.data);
        }else if(response.data.success == true){
          message.success('Leave updated successfully!');
        }
      } else {
        const response = await employeeInstance.post("/employee-service/api/leave/pre-apply-leave", newLeave);
        if(response.data.success == false ){
          message.error(response.data.message);
          console.log('response.data', response.data);
        }else if(response.data.success == true){
          message.success('Leave applied successfully!');
        }
        
      }
  
      setDrawerVisible(false);
      form.resetFields();
      setCurrentLeave(null);
      fetchData();
    } catch (error) {
      console.error("Error applying leave:", error);
    }
  };

  const cancelLeave = async (leaveId: string) => {
    try {
      await employeeInstance.delete(`/employee-service/api/leave/delete-applied-leave/${leaveId}`);
      fetchData();
    } catch (error) {
      console.error("Error cancelling leave:", error);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getLeaveTypeColor = (): string => {
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6 gap-4">
        <Button 
          type="primary" 
          icon={<CalendarOutlined />} 
          onClick={() => {
            setCurrentLeave(null);
            form.resetFields();
            setDrawerVisible(true);
          }}
          className="hover:scale-105 transition-transform"
        >
          Apply Leave
        </Button>
        <div className="flex gap-4 flex-1 justify-end">
          <Search
            placeholder="Search leaves..."
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
            className="hover:shadow-md transition-shadow"
          />
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={setSelectedType}
            className="hover:shadow-md transition-shadow"
          >
            <Select.Option value="all">All Types</Select.Option>
            {leaveTypes.map(type => (
              <Select.Option key={type.type} value={type.type}>
                {type.type}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <Card className="shadow-lg rounded-lg overflow-hidden">
        <List 
          dataSource={filteredLeaves.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredLeaves.length,
            onChange: setCurrentPage,
          }}
          renderItem={(item) => (
            <List.Item className="hover:bg-gray-50 transition-colors duration-200 border-b last:border-b-0">
              <div className="w-full p-4 transform hover:scale-[1.01] transition-transform duration-200">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLeaveTypeColor()}`}>
                        {item.leaveType}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <ClockCircleOutlined /> Applied: {dayjs(item.appliedAt).format('MMM DD, YYYY')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-gray-600">
                        <span className="font-medium">Duration: </span>
                        {item.duration} day(s) ({item.duration >= 1 ? 'Full Day' : 'Half Day'})
                        {item.duration < 1 && (item.isFirstHalf ? ' - First Half' : ' - Second Half')}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Date Range: </span>
                        {item.fromDate} to {item.toDate}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-gray-600">
                        <span className="font-medium">Reason: </span>
                        {item.reason}
                      </div>
                      {item.rejectionReason && (
                        <div className="text-red-600">
                          <span className="font-medium">Rejection Reason: </span>
                          {item.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Button icon={<EditOutlined />} onClick={() => handleEditClick(item)} size="small">
                        Edit
                      </Button>
                      <Button icon={<DeleteOutlined />} onClick={() => cancelLeave(item.leaveId)} size="small" danger>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Drawer
      title={currentLeave ? "Edit Leave" : "Apply Leave"}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false);
        setCurrentLeave(null);
        form.resetFields();
        setShowHalfDayOptions(false);
      }}
      width={400}
      footer={null}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="leaveTypes" label="Leave Type" rules={[{ required: true }]}>
          <Select placeholder="Select leave type">
            {leaveTypes.map((type) => (
              <Select.Option key={type.type} value={type.type}>
                {type.type} ({type.available} days)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="dates" label="Leave Duration" rules={[{ required: true }]}>
          <RangePicker
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item name="dayType" label="Day Type" rules={[{ required: true }]}>
          <Radio.Group onChange={handleDayTypeChange}>
            <Radio value="full" disabled={selectedDays === 0}>Full Day</Radio>
            <Radio value="half" disabled={selectedDays !== 1}>Half Day</Radio>
          </Radio.Group>
        </Form.Item>

        {showHalfDayOptions && (
          <Form.Item 
            name="halfDayType" 
            label="Half Day Type" 
            rules={[{ required: true, message: 'Please select half day type' }]}
          >
            <Radio.Group>
              <Radio value="first">First Half</Radio>
              <Radio value="second">Second Half</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Enter reason" />
        </Form.Item>

        <div className="flex justify-between">
          <span className="text-gray-600">
            Duration: {form.getFieldValue('dayType') === 'half' ? '0.5' : selectedDays} day(s)
          </span>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Drawer>
    </div>
  );
};

export default EmployeeLeave;
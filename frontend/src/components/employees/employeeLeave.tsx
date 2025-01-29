import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Radio, Input, Button, Card, List, Drawer } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { employeeInstance } from '../../services/employeeInstance';

const { RangePicker } = DatePicker;
const { Search } = Input;

interface LeaveType {
  type: string;
  available: number;
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
}

interface LeaveFormValues {
  leaveTypes: string;
  dates: [Dayjs, Dayjs];
  dayType: 'full' | 'half';
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
  const pageSize = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [typesRes, leavesRes] = await Promise.all([
        employeeInstance.get("/employee-service/api/attendance/get-approved-leaves"),
        employeeInstance.get("/employee-service/api/leave/get-applied-leaves")
      ]);

      const types: LeaveType[] = Object.entries(typesRes.data).map(([type, available]) => ({ 
        type, 
        available: Number(available) 
      }));
      setLeaveTypes(types);

      const formattedLeaves: AppliedLeave[] = leavesRes.data.map((leave: { leaveType: any; startDate: string | number | Date | dayjs.Dayjs | null | undefined; endDate: string | number | Date | dayjs.Dayjs | null | undefined; duration: any; reason: any; dayType: any; status: any; createdAt: string | number | Date | dayjs.Dayjs | null | undefined; rejectionReason: any; leaveId: any; employeeId: any; }) => ({
        leaveType: leave.leaveType,
        fromDate: dayjs(leave.startDate).format('YYYY-MM-DD'),
        toDate: dayjs(leave.endDate).format('YYYY-MM-DD'),
        duration: leave.duration,
        reason: leave.reason,
        dayType: leave.dayType || 'full',
        status: leave.status,
        appliedAt: dayjs(leave.createdAt).format('YYYY-MM-DD'),
        rejectionReason: leave.rejectionReason,
        leaveId: leave.leaveId,
        employeeId: leave.employeeId,
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
      filtered = filtered.filter(leave => leave.leaveType.includes(selectedType));
    }

    setFilteredLeaves(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterLeaves();
  }, [searchText, selectedType, leaves]);

  const handleDateChange = (
    dates: [Dayjs | null, Dayjs | null] | null, 
    // dateStrings: [string, string]
  ) => {
    if (dates && dates[0] && dates[1]) {
      let duration = 0;
      let currentDate = dates[0];
  
      while (currentDate.isBefore(dates[1], 'day') || currentDate.isSame(dates[1], 'day')) {
        if (currentDate.day() !== 0) { // Check if it's not Sunday (0 represents Sunday)
          duration++;
        }
        currentDate = currentDate.add(1, 'day');
      }
  
      setSelectedDays(duration);
  
      // Check if duration exceeds available leave for the selected leave type
      const selectedLeaveType = form.getFieldValue('leaveTypes');
      const leaveType = leaveTypes.find((type) => type.type === selectedLeaveType);
  
      if (leaveType && duration > leaveType.available) {
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
      form.setFields([{ name: 'dates', errors: [] }]);
    }
  };
  
  const onFinish = async (values: LeaveFormValues) => {
    try {
      // Check if 'Half Day' is selected and ensure duration is 1 day
      if (values.dayType === 'half' && selectedDays !== 1) {
        form.setFields([
          {
            name: 'dayType',
            errors: ['Half Day can only be selected for a duration of 1 day.'],
          },
        ]);
        return;
      }
  
      // Check if the duration exceeds available leaves
      const selectedLeaveType = leaveTypes.find(type => type.type === values.leaveTypes);
      if (selectedDays > (selectedLeaveType?.available || 0)) {
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
        duration: values.dayType === 'half' ? 0.5 : selectedDays,
        dayType: values.dayType,
        reason: values.reason,
      };
  
      if (currentLeave) {
        await employeeInstance.post(`/employee-service/api/leave/update-applied-leave/${currentLeave.leaveId}`, newLeave);
      } else {
        // Apply new leave
        await employeeInstance.post("/employee-service/api/leave/pre-apply-leave", newLeave);
      }
  
      setDrawerVisible(false);
      form.resetFields();
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

  const handleEditClick = (leave: AppliedLeave) => {
    setCurrentLeave(leave);
    form.setFieldsValue({
      leaveTypes: leave.leaveType,
      dates: [dayjs(leave.fromDate), dayjs(leave.toDate)],
      dayType: leave.dayType,
      reason: leave.reason,
    });
    setSelectedDays(leave.duration);
    setDrawerVisible(true);
  };

  console.log("currentLeave:", currentLeave);
  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getLeaveTypeColor = () => {
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6 gap-4">
        <Button 
          type="primary" 
          icon={<CalendarOutlined />} 
          onClick={() => setDrawerVisible(true)}
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
                        {item.duration} day(s) ({item.dayType})
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

                  {/* Action buttons */}
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

      {/* Drawer for Apply/Edit Leave */}
      <Drawer
        title={currentLeave ? "Edit Leave" : "Apply Leave"}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={400}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="leaveTypes" label="Leave Type" rules={[{ required: true }]}>
            <Select placeholder="Select leave type">
              {leaveTypes.map((type) => (
                <Select.Option key={type.type} value={type.type}>
                  {type.type}({type.available})days
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="dates" label="Leave Duration" rules={[{ required: true }]}>
            <RangePicker
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              defaultValue={[dayjs(currentLeave?.fromDate), dayjs(currentLeave?.toDate)]}
            />
          </Form.Item>

          <Form.Item name="dayType" label="Day Type" rules={[{ required: true }]}>
  <Radio.Group>
    <Radio value="full">Full Day</Radio>
    <Radio value="half">Half Day</Radio>
  </Radio.Group>
</Form.Item>

          <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Enter reason" />
          </Form.Item>

          <div className="flex justify-between">
            <span className="text-gray-600">Duration: {selectedDays} day(s)</span>
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

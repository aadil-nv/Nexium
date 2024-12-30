import React, { useState } from 'react';
import { Form, Select, DatePicker, Radio, Button, Card, List, Tag, Drawer } from 'antd';
import { motion } from 'framer-motion';
import { CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

interface LeaveType {
  type: string;
  available: number;
}

interface LeaveApplication {
  leaveTypes: string[];
  fromDate: string;
  toDate: string;
  duration: number;
  dayType: 'full' | 'half';
}

const EmployeeLeave: React.FC = () => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [appliedLeaves, setAppliedLeaves] = useState<LeaveApplication[]>([]);
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [exceedsLimit, setExceedsLimit] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const leaveTypes: LeaveType[] = [
    { type: 'Casual Leave', available: 12 },
    { type: 'Sick Leave', available: 15 },
    { type: 'Privilege Leave', available: 10 },
  ];

  const calculateDays = (dates: [Dayjs, Dayjs]) => {
    if (!dates) return;
    const diffDays = dates[1].diff(dates[0], 'days') + 1;
    setSelectedDays(diffDays);

    const selectedLeaves = form.getFieldValue('leaveTypes');
    if (selectedLeaves) {
      const totalAvailable = selectedLeaves.reduce((total: number, type: string) => {
        const leave = leaveTypes.find(l => l.type === type);
        return total + (leave?.available || 0);
      }, 0);
      setExceedsLimit(diffDays > totalAvailable);
    }
  };

  const onFinish = (values: any) => {
    const newLeave: LeaveApplication = {
      leaveTypes: values.leaveTypes,
      fromDate: values.dates[0].format('YYYY-MM-DD'),
      toDate: values.dates[1].format('YYYY-MM-DD'),
      duration: values.dayType === 'half' ? selectedDays / 2 : selectedDays,
      dayType: values.dayType,
    };
    setAppliedLeaves([...appliedLeaves, newLeave]);
    form.resetFields();
    setSelectedDays(0);
    setExceedsLimit(false);
    setDrawerVisible(false);
  };

  return (
    <div className="p-4">
      <Button
        type="primary"
        icon={<CalendarOutlined />}
        onClick={() => setDrawerVisible(true)}
        className="mb-4"
      >
        Apply Leave
      </Button>

      <Drawer
        title="Apply Leave"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="leaveTypes"
            label="Select Leave Types"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Select leave types"
              onChange={() => {
                const dates = form.getFieldValue('dates');
                if (dates) calculateDays(dates);
              }}
            >
              {leaveTypes.map(leave => (
                <Select.Option key={leave.type} value={leave.type}>
                  {leave.type} ({leave.available} days available)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dates"
            label="Select Dates"
            rules={[{ required: true }]}
            validateStatus={exceedsLimit ? "error" : ""}
            help={exceedsLimit ? "Selected days exceed available leave balance" : ""}
          >
            <RangePicker
              onChange={(dates) => calculateDays(dates as [Dayjs, Dayjs])}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="dayType"
            label="Day Type"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="full">Full Day</Radio>
              <Radio value="half">Half Day</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="mb-4">
            Selected Days: {selectedDays} {selectedDays === 1 ? 'day' : 'days'}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            disabled={exceedsLimit}
          >
            Submit Leave
          </Button>
        </Form>
      </Drawer>

      <Card
        title="Applied Leaves"
        className="shadow-lg"
      >
        <List
          dataSource={appliedLeaves}
          renderItem={(item) => (
            <List.Item>
              <div>
                <div>
                  {item.leaveTypes.join(', ')}
                </div>
                <div>
                  {item.fromDate} to {item.toDate} ({item.duration} days)
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default EmployeeLeave;

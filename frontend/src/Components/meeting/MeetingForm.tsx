import React from 'react';
import { Form, Input, DatePicker, TimePicker, Select, Card, Space, Avatar, Button, Typography, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { UserOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Participant, FormValues } from '../../interface/meetingInterface';
import dayjs from 'dayjs';

const { Text } = Typography;

interface MeetingFormProps {
  form: FormInstance<FormValues>;
  editingMeeting: string | null;
  selectedParticipants: string[];
  allParticipants: Participant[];
  onParticipantChange: (selectedIds: string[]) => void;
  onRemoveParticipant: (participantId: string) => void;
  onFinish: (values: FormValues) => void;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
  form,
  editingMeeting,
  selectedParticipants,
  allParticipants,
  onParticipantChange,
  onRemoveParticipant,
  onFinish
}) => {
  // Get current date and time
  const now = dayjs();

  // Function to disable past dates in DatePicker
  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current.isBefore(now, 'day');
  };

  // Function to disable past times for the current date in TimePicker
  const disabledTime = (selectedDate: dayjs.Dayjs | null) => {
    const currentHour = now.hour();
    const currentMinute = now.minute();

    if (selectedDate && selectedDate.isSame(now, 'day')) {
      return {
        disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
        disabledMinutes: (selectedHour: number) => {
          if (selectedHour === currentHour) {
            return Array.from({ length: currentMinute }, (_, i) => i);
          }
          return [];
        }
      };
    }
    return {};
  };

  // Custom validation for the meeting time
  const validateMeetingTime = (_: unknown, value: dayjs.Dayjs) => {
    const selectedDate = form.getFieldValue('meetingDate');
    
    if (!selectedDate) {
      return Promise.reject('Please select a date first');
    }

    const combinedDateTime = selectedDate.hour(value.hour()).minute(value.minute());
    
    if (combinedDateTime.isBefore(now)) {
      return Promise.reject('Cannot select a past time');
    }
    
    return Promise.resolve();
  };

  const renderParticipantOption = (participant: Participant) => (
    <Select.Option key={participant.userId} value={participant.userId}>
      <Space>
        <Avatar src={participant.profilePicture} icon={<UserOutlined />} />
        <div>
          <div>{participant.userName}</div>
          <div className="text-xs text-gray-500">{participant.userPosition}</div>
        </div>
      </Space>
    </Select.Option>
  );

  // Handle form submission with additional validation
  const handleFinish = (values: FormValues) => {
    const combinedDateTime = values.meetingDate
      .hour(values.meetingTime.hour())
      .minute(values.meetingTime.minute());

    if (combinedDateTime.isBefore(now)) {
      message.error('Cannot schedule a meeting in the past');
      return;
    }

    onFinish(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        name="meetingTitle"
        label="Meeting Title"
        rules={[{ required: true, message: "Please enter meeting title" }]}
      >
        <Input placeholder="Enter meeting title" />
      </Form.Item>
      
      <Form.Item
        name="meetingDate"
        label="Meeting Date"
        rules={[
          { required: true, message: "Please select a date" },
          {
            validator: (_, value) => {
              if (value && value.isBefore(now, 'day')) {
                return Promise.reject('Cannot select a past date');
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <DatePicker 
          style={{ width: "100%" }} 
          disabledDate={disabledDate}
          onChange={() => {
            // Clear time when date changes to prevent invalid combinations
            form.setFieldValue('meetingTime', null);
          }}
        />
      </Form.Item>
      
      <Form.Item
        name="meetingTime"
        label="Meeting Time"
        rules={[
          { required: true, message: "Please select meeting time" },
          { validator: validateMeetingTime }
        ]}
        dependencies={['meetingDate']}
      >
        <TimePicker
          format="hh:mm A"
          style={{ width: "100%" }}
          use12Hours
          className="w-full"
          disabledTime={() => disabledTime(form.getFieldValue('meetingDate'))}
        />
      </Form.Item>
      
      <Form.Item
        name="participants"
        label="Participants"
        rules={[{ required: true, message: "Please select at least one participant" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select participants"
          value={selectedParticipants}
          onChange={onParticipantChange}
          style={{ width: '100%' }}
          optionLabelProp="label"
        >
          {allParticipants
            .filter(p => !selectedParticipants.includes(p.userId))
            .map(renderParticipantOption)}
        </Select>
      </Form.Item>

      {selectedParticipants.length > 0 && (
        <div className="mb-4">
          <Text strong>Selected Participants:</Text>
          <div className="mt-2 space-y-2">
            {selectedParticipants.map(id => {
              const participant = allParticipants.find(p => p.userId === id);
              if (!participant) return null;
              return (
                <Card size="small" key={id} className="bg-gray-50">
                  <Space className="w-full justify-between">
                    <Space>
                      <Avatar src={participant.profilePicture} icon={<UserOutlined />} />
                      <div>
                        <div>{participant.userName}</div>
                        <div className="text-xs text-gray-500">{participant.userPosition}</div>
                      </div>
                    </Space>
                    <Button
                      type="text"
                      icon={<CloseCircleOutlined />}
                      onClick={() => onRemoveParticipant(id)}
                      danger
                    />
                  </Space>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Button type="primary" htmlType="submit" className="w-full">
        {editingMeeting ? "Update Meeting" : "Schedule Meeting"}
      </Button>
    </Form>
  );
};
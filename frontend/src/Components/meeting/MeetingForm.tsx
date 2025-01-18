// components/MeetingForm.tsx
import React from 'react';
import { Form, Input, DatePicker, TimePicker, Select, Card, Space, Avatar, Button, Typography } from 'antd';
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

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish} // Using the onFinish prop directly
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
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      
      <Form.Item
        name="meetingTime"
        label="Meeting Time"
        rules={[{ required: true, message: "Please select meeting time" }]}
      >
        <TimePicker
          format="hh:mm A"
          style={{ width: "100%" }}
          use12Hours
          className="w-full"
        />
      </Form.Item>
      
      <Form.Item
        label="Participants"
        required
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
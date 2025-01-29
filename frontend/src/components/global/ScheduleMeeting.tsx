import React from 'react';
import { Modal, Form, Input, DatePicker, Select} from 'antd';
import type { Moment } from 'moment';


const { RangePicker } = DatePicker;
const { Option } = Select;

interface ScheduleMeetingProps {
  visible: boolean;
  onOk: (values: MeetingFormValues) => void;
  onCancel: () => void;
  participants: { id: number; name: string }[];
}
interface MeetingFormValues {
  title: string;
  time: [Moment, Moment];
  participants: number[];
}

const ScheduleMeeting: React.FC<ScheduleMeetingProps> = ({ visible, onOk, onCancel, participants }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(onOk);
  };

  return (
    <Modal title="Schedule a Meeting" visible={visible} onOk={handleOk} onCancel={onCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Meeting Title" name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
          <Input placeholder="Enter meeting title" />
        </Form.Item>
        <Form.Item
          label="Meeting Time"
          name="time"
          rules={[{ required: true, message: 'Please select a time range' }]}
        >
          <RangePicker showTime />
        </Form.Item>
        <Form.Item label="Participants" name="participants">
          <Select mode="multiple" placeholder="Select participants">
            {participants.map((participant) => (
              <Option key={participant.id} value={participant.id}>
                {participant.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleMeeting;

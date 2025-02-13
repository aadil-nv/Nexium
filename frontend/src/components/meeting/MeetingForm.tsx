import React from 'react';
import { Form, Input, DatePicker, TimePicker, Select, Avatar, Button, Switch, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { UserOutlined, CloseCircleOutlined, UsergroupAddOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Participant, ScheduledBy } from '../../interface/meetingInterface';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

export interface FormValues {
  meetingTitle: string;
  meetingDate: dayjs.Dayjs;
  meetingTime: dayjs.Dayjs;
  participants: string[];
  scheduledBy: ScheduledBy;
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly';
  recurringDay?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
}

interface MeetingFormProps {
  form: FormInstance<FormValues>;
  editingMeeting: string | null;
  selectedParticipants: string[];
  allParticipants: Participant[];
  onParticipantChange: (selectedIds: string[]) => void;
  onRemoveParticipant: (participantId: string) => void;
  onFinish: (values: FormValues) => void;
}

interface ParticipantOptionProps {
  participant: Participant;
  isSelected: boolean;
}

const ParticipantOption: React.FC<ParticipantOptionProps> = ({ participant, isSelected }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
  >
    <div className="flex items-center gap-2">
      <Avatar src={participant.profilePicture} icon={<UserOutlined />} />
      <div>
        <div className="font-medium">{participant.userName}</div>
        {/* <div className="text-xs text-gray-500">{participant.userPosition}</div> */}
      </div>
    </div>
    {isSelected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <CheckCircleFilled className="text-blue-500" />
      </motion.div>
    )}
  </motion.div>
);

export const MeetingForm: React.FC<MeetingFormProps> = ({
  form,
  editingMeeting,
  selectedParticipants,
  allParticipants,
  onParticipantChange,
  onRemoveParticipant,
  onFinish
}) => {
  const now = dayjs();

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current.isBefore(now, 'day');
  };

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
    <Select.Option key={participant.userId} value={participant.userId} label={participant.userName}>
      <ParticipantOption
        participant={participant}
        isSelected={selectedParticipants.includes(participant.userId)}
      />
    </Select.Option>
  );

  const tagRender = (props: CustomTagProps) => {
    const participant = allParticipants.find(p => p.userId === props.value);
    if (!participant) return <></>;
    
    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 mr-1 mb-1"
      >
        <Avatar
          src={participant.profilePicture}
          icon={<UserOutlined />}
          size="small"
          className="mr-1"
        />
        <span className="mr-1">{participant.userName}</span>
        <CloseCircleOutlined
          className="cursor-pointer text-gray-500 hover:text-red-500"
          onClick={(e) => {
            e.preventDefault();
            onRemoveParticipant(participant.userId);
          }}
        />
      </motion.span>
    );
  };

  const handleFinish = (values: FormValues) => {
    const combinedDateTime = values.meetingDate
      .hour(values.meetingTime.hour())
      .minute(values.meetingTime.minute());

    if (combinedDateTime.isBefore(now)) {
      message.error('Cannot schedule a meeting in the past');
      return;
    }

    console.log("values is --->" ,values);
    

    onFinish(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="space-y-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Form.Item
          name="meetingTitle"
          label="Meeting Title"
          rules={[{ required: true, message: "Please enter meeting title" }]}
        >
          <Input
            prefix={<i className="fas fa-meeting" />}
            placeholder="Enter meeting title"
          />
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
          name="isRecurring"
          label="Recurring Meeting"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.isRecurring !== currentValues.isRecurring
          }
        >
          {({ getFieldValue }) => {
            const isRecurring = getFieldValue('isRecurring');
            return isRecurring ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <Form.Item
                  name="recurringType"
                  label="Recurring Type"
                  rules={[{ required: true, message: "Please select recurring type" }]}
                >
                  <Select>
                    <Select.Option value="daily">Daily</Select.Option>
                    <Select.Option value="weekly">Weekly</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => 
                    prevValues.recurringType !== currentValues.recurringType
                  }
                >
                  {({ getFieldValue }) => {
                    const recurringType = getFieldValue('recurringType');
                    return recurringType === 'weekly' ? (
                      <Form.Item
                        name="recurringDay"
                        label="Recurring Day"
                        rules={[{ required: true, message: "Please select recurring day" }]}
                      >
                        <Select>
                          <Select.Option value="monday">Monday</Select.Option>
                          <Select.Option value="tuesday">Tuesday</Select.Option>
                          <Select.Option value="wednesday">Wednesday</Select.Option>
                          <Select.Option value="thursday">Thursday</Select.Option>
                          <Select.Option value="friday">Friday</Select.Option>
                          <Select.Option value="saturday">Saturday</Select.Option>
                          <Select.Option value="sunday">Sunday</Select.Option>
                        </Select>
                      </Form.Item>
                    ) : null;
                  }}
                </Form.Item>
              </motion.div>
            ) : null;
          }}
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
            suffixIcon={<UsergroupAddOutlined className="text-blue-500" />}
            tagRender={tagRender}
          >
            {allParticipants
              .filter(p => !selectedParticipants.includes(p.userId))
              .map(renderParticipantOption)}
          </Select>
        </Form.Item>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button type="primary" htmlType="submit" className="w-full">
            {editingMeeting ? "Update Meeting" : "Schedule Meeting"}
          </Button>
        </motion.div>
      </motion.div>
    </Form>
  );
};
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Drawer,
  Form,
  Input,
  DatePicker,
  Card,
  Typography,
  Space,
  Avatar,
  Tag,
  Popconfirm,
  message,
  Pagination,
  TimePicker,
  Select,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  VideoCameraOutlined,
  SearchOutlined,
  CopyOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { chatInstance } from "../../services/chatInstance";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


const { Title, Text } = Typography;
const { Option } = Select;

interface Participant {
  userId: string;
  userName: string;
  userPosition: string;
  profilePicture: string;
}

interface Meeting {
  _id: string;
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  participants: Participant[];
  meetingLink: string;
  scheduledBy: scheduledBy;
}

interface scheduledBy {
  userId : string;
  userName: string;
  userPosition: string;
  profilePicture: string;
}

interface FormValues {
  meetingTitle: string;
  meetingDate: Dayjs;
  meetingTime: Dayjs;
  participants: string[];
  scheduledBy: scheduledBy;
}

const AnimatedIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <motion.div
    initial={{ scale: 1 }}
    whileHover={{ scale: 1.2, rotate: 10 }}
    whileTap={{ scale: 0.9 }}
    style={{ display: "inline-flex" }}
  >
    {icon}
  </motion.div>
);

const MeetingScheduler: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [editingMeeting, setEditingMeeting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [meetingsPerPage] = useState(6);
  const [form] = Form.useForm<FormValues>();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const navigate = useNavigate();
  const {businessOwner , employee , manager} = useAuth();

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchMeetings();
    fetchParticipants();
  }, []);

  const getRandomColor = () => {
    const colors = ['blue', 'green', 'cyan', 'purple', 'magenta'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleDelete = async (meetingId: string) => {
    try {
      await chatInstance.delete(`/chatService/api/meeting/delete-meeting/${meetingId}`);
      message.success("Meeting deleted successfully");
      fetchMeetings();
    } catch (error) {
      message.error("Failed to delete meeting");
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
      .then(() => message.success("Meeting link copied to clipboard"))
      .catch(() => message.error("Failed to copy meeting link"));
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.scheduledBy.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = filteredMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

  const fetchParticipants = async () => {
    try {
      const response = await chatInstance.get("/chatService/api/meeting/get-all-participants");
      setAllParticipants(response.data);
    } catch (error) {
      message.error("Failed to fetch participants");
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await chatInstance.get("/chatService/api/meeting/get-all-meetings");
      setMeetings(response.data);
    } catch (error) {
      message.error("Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (values: FormValues) => {
    try {
      const roomID = Math.random().toString(36).substring(7);
      const meetingDate = values.meetingDate
        .hour(values.meetingTime.hour())
        .minute(values.meetingTime.minute())
        .second(values.meetingTime.second())
        .toISOString();
      const meetingTime = values.meetingDate
        .hour(values.meetingTime.hour())
        .minute(values.meetingTime.minute())
        .second(values.meetingTime.second())
        .toISOString();
  
      const formattedMeeting = {
        meetingTitle: values.meetingTitle,
        meetingDate: meetingDate,
        meetingTime: meetingTime,
        participants: selectedParticipants,
        scheduledBy: values.scheduledBy,
        meetingLink: `hgsjdfa7453`,
      };
    
      await chatInstance.post("/chatService/api/meeting/create-meeting", formattedMeeting);
      message.success("Meeting scheduled successfully");
      fetchMeetings();
      handleCloseDrawer();
    } catch (error) {
      message.error("Failed to create meeting");
      console.error(error);
    }
  };
  
  const handleUpdateMeeting = async (values: FormValues) => {
    if (!editingMeeting) {
      message.error("No meeting selected for update");
      return;
    }
  
    try {
      const meetingDate = values.meetingDate
        .hour(values.meetingTime.hour())
        .minute(values.meetingTime.minute())
        .second(values.meetingTime.second())
        .toISOString();
      const meetingTime = values.meetingDate
        .hour(values.meetingTime.hour())
        .minute(values.meetingTime.minute())
        .second(values.meetingTime.second())
        .toISOString();
  
      const formattedMeeting = {
        meetingTitle: values.meetingTitle,
        meetingDate: meetingDate,
        meetingTime: meetingTime,
        participants: selectedParticipants,
        scheduledBy: values.scheduledBy
      };
  
      await chatInstance.patch(
        `/chatService/api/meeting/update-meeting/${editingMeeting}`,
        formattedMeeting
      );
      message.success("Meeting updated successfully");
      fetchMeetings();
      handleCloseDrawer();
    } catch (error) {
      message.error("Failed to update meeting");
      console.error(error);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingMeeting(null);
    setSelectedParticipants([]);
    form.resetFields();
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting._id);
    setSelectedParticipants(meeting.participants.map(p => p.userId));
    
    const meetingDate = dayjs(meeting.meetingTime);
    const meetingTime = dayjs(meeting.meetingTime);
    
    const formValues: FormValues = {
      meetingTitle: meeting.meetingTitle,
      meetingDate: meetingDate,
      meetingTime: meetingTime,
      participants: meeting.participants.map(p => p.userId),
      scheduledBy: meeting.scheduledBy
    };
    
    form.setFieldsValue(formValues);
    setIsDrawerOpen(true);
  };

  const handleParticipantChange = (selectedIds: string[]) => {
    setSelectedParticipants(selectedIds);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setSelectedParticipants(prev => prev.filter(id => id !== participantId));
  };

  const renderParticipantOption = (participant: Participant) => (
    <Option key={participant.userId} value={participant.userId}>
      <Space>
        <Avatar src={participant.profilePicture} icon={<UserOutlined />} />
        <div>
          <div>{participant.userName}</div>
          <div className="text-xs text-gray-500">{participant.userPosition}</div>
        </div>
      </Space>
    </Option>
  );

  const handleJoinMeeting = (meetingLink: string) => {
    if(businessOwner.isAuthenticated){
      navigate(`/business-owner/join-meeting?roomID=${meetingLink}`);
    }else if (employee.isAuthenticated) {
      navigate(`/employee/join-meeting?roomID=${meetingLink}`);

    }else if (manager.isAuthenticated) {
      navigate(`/manager/join-meeting?roomID=${meetingLink}`);
    }
    
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center gap-4 mb-6">
          <Title level={isSmallScreen ? 3 : 2} className="text-indigo-600">
            <AnimatedIcon icon={<VideoCameraOutlined />} /> Meeting Scheduler
          </Title>
          <div className="flex gap-4">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
            <Button
              type="primary"
              size={isSmallScreen ? "middle" : "large"}
              icon={<PlusOutlined />}
              onClick={() => setIsDrawerOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-md rounded-lg"
            >
              Schedule Meeting
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {currentMeetings.map((meeting) => (
              <motion.div
                key={meeting._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card
                  className="rounded-lg shadow-md"
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(meeting)}
                    />,
                    <Popconfirm
                      key="delete"
                      title="Delete meeting?"
                      onConfirm={() => handleDelete(meeting._id)}
                    >
                      <Button type="text" icon={<DeleteOutlined />} danger />
                    </Popconfirm>,
                    <Button
                      key="copy"
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopyLink(meeting.meetingLink)}
                    />,
                  ]}
                  extra={
                    <Tag color={getRandomColor()}>
                      {dayjs(meeting.meetingTime).format("hh:mm A")}
                    </Tag>
                  }
                >
                  <Space direction="vertical" className="w-full">
                    <Space>
                      <Avatar
                        icon={<VideoCameraOutlined />}
                        className="bg-indigo-600"
                      />
                      <div>
                        <Text strong>{meeting.meetingTitle}</Text>
                        <div className="text-gray-500 flex items-center gap-2">
                          <CalendarOutlined /> {dayjs(meeting.meetingTime).format("YYYY-MM-DD")}
                        </div>
                      </div>
                    </Space>
                    <div className="mt-3">
                      <div className="text-gray-500 flex items-center gap-2">
                        <TeamOutlined /> {meeting.participants.length} Participants
                      </div>
                      <div className="text-gray-500 flex items-center gap-2 mt-2">
                        <UserOutlined /> Scheduled by: {meeting.scheduledBy.userName}
                      </div>
                    </div>
                    <Button
        type="primary"
        icon={<VideoCameraOutlined />}
        className="w-full mt-3 bg-green-500 hover:bg-green-600"
        onClick={() => handleJoinMeeting(meeting.meetingLink)}
      >
        Join Now
      </Button>
                  </Space>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={meetingsPerPage}
            total={filteredMeetings.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>

        <Drawer
          title={editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}
          placement="right"
          width={isSmallScreen ? "100%" : 520}
          onClose={handleCloseDrawer}
          open={isDrawerOpen}
        >
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={editingMeeting ? handleUpdateMeeting : handleCreateMeeting}
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
                onChange={handleParticipantChange}
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
                            onClick={() => handleRemoveParticipant(id)}
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
        </Drawer>
      </div>
    </div>
  );
};

export default MeetingScheduler;
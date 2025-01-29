import React, { useState, useEffect } from "react";
import { Button, Drawer, Input, Typography, Pagination, message, Spin } from "antd";
import { VideoCameraOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { Form } from "antd";
import useAuth from "../../hooks/useAuth";
import { communicationInstance } from "../../services/communicationInstance";
import { AnimatedIcon } from "./AnimatedIcon";
import { MeetingCard } from "./MeetingCard";
import { MeetingForm } from "./MeetingForm";
import { Meeting, Participant, FormValues } from "../../interface/meetingInterface";

const { Title } = Typography;

export const MeetingScheduler: React.FC = () => {
  // State management
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
  const { businessOwner, employee, manager } = useAuth();
  const hasScheduluePermission = 
    businessOwner.isAuthenticated || 
    manager.isAuthenticated || 
    (employee.isAuthenticated && employee.position === 'Team Lead');

  // Effects
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchMeetings();
    fetchParticipants();
  }, []);

  // API calls
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await communicationInstance.get("/communication-service/api/meeting/get-all-meetings");
      setMeetings(response.data);
    } catch (error) {
      message.error((error as Error).message || "Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await communicationInstance.get("/communication-service/api/meeting/get-all-participants");
      setAllParticipants(response.data);
    } catch (error) {
      message.error((error as Error).message || "Failed to fetch participants");
    }
  };

  // Meeting handlers
  const handleCreateMeeting = async (values: FormValues) => {
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
        scheduledBy: values.scheduledBy,
        meetingLink: `hgsjdfa7453`,
      };

      await communicationInstance.post("/communication-service/api/meeting/create-meeting", formattedMeeting);
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

      await communicationInstance.patch(
        `/communication-service/api/meeting/update-meeting/${editingMeeting}`,
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

  const handleDelete = async (meetingId: string) => {
    try {
      await communicationInstance.delete(`/communication-service/api/meeting/delete-meeting/${meetingId}`);
      message.success("Meeting deleted successfully");
      fetchMeetings();
    } catch (error) {
      message.error((error as Error).message || "Failed to delete meeting");
    }
  };

  // UI handlers
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

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
      .then(() => message.success("Meeting link copied to clipboard"))
      .catch(() => message.error("Failed to copy meeting link"));
  };

  const handleJoinMeeting = (meetingLink: string) => {
    if (businessOwner.isAuthenticated) {
      navigate(`/business-owner/join-meeting?roomID=${meetingLink}`);
    } else if (employee.isAuthenticated) {
      navigate(`/employee/join-meeting?roomID=${meetingLink}`);
    } else if (manager.isAuthenticated) {
      navigate(`/manager/join-meeting?roomID=${meetingLink}`);
    }
  };

  const handleParticipantChange = (selectedIds: string[]) => {
    setSelectedParticipants(selectedIds);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setSelectedParticipants(prev => prev.filter(id => id !== participantId));
  };

  // Filtered meetings
  const filteredMeetings = meetings.filter(meeting =>
    meeting.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.scheduledBy.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = filteredMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
             {hasScheduluePermission && (
                <Button
                  type="primary"
                  size={isSmallScreen ? "middle" : "large"}
                  icon={<PlusOutlined />}
                  onClick={() => setIsDrawerOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 shadow-md rounded-lg"
                >
                  Schedule Meeting
                </Button>
              )}
            </div>
          </div>

          {/* Meeting Cards Grid */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {currentMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting._id}
                  meeting={meeting}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCopyLink={handleCopyLink}
                  onJoinMeeting={handleJoinMeeting}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
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
            <MeetingForm
              form={form}
              editingMeeting={editingMeeting}
              selectedParticipants={selectedParticipants}
              allParticipants={allParticipants}
              onParticipantChange={handleParticipantChange}
              onRemoveParticipant={handleRemoveParticipant}
              onFinish={editingMeeting ? handleUpdateMeeting : handleCreateMeeting}
            />
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduler;
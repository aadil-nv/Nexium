import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Drawer, Avatar, Badge, Button, Skeleton, Modal } from 'antd';
import { MenuOutlined, TeamOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import useTheme from '../../hooks/useTheme';
import ChatPeoples from './ChatPeople';
import ChatWindow from './ChatWindow';
import EditGroupModal from './EditGroup';
import { Employee, Group } from '../../interface/ChatInterface';
import { communicationInstance } from '../../services/communicationInstance';
import GroupMembersModal from "../../components/chat/GroupMembersModal";
import useAuth from '../../hooks/useAuth';

const { Header, Content, Sider } = Layout;
const { confirm } = Modal;

interface ChatTarget {
  chatId: string;
  senderId: string;
  receiverId: string[];
  id: string;
  name: string;
  avatar?: string;
  type: 'private' | 'group';
  status?: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  profilePicture?: string;
  position: string;
}

const MainLayout: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<ChatTarget | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [siderVisible, setSiderVisible] = useState<boolean>(!isMobile);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGroupMembersModalOpen, setIsGroupMembersModalOpen] = useState<boolean>(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState<boolean>(false);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const { themeColor } = useTheme();
  const {employee ,businessOwner,manager} = useAuth();
  const isEmployee = employee?.isAuthenticated;
  const senderName = employee?.employeeName || businessOwner?.companyName || manager?.managerName

  const formatLastSeen = useCallback((date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return 'Invalid date';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  }, []);

  const handleDeleteGroup = async (groupId: string) => {    
    confirm({
      title: 'Are you sure you want to delete this group?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: async () => {
        try {
          await communicationInstance.delete(`/communication-service/api/chat/delete-group/${groupId}`);
          setGroups(prevGroups => prevGroups.filter(group => group.groupId !== groupId));
          if (selectedTarget?.id === groupId) {
            setSelectedTarget(null);
          }
          await fetchGroups();
        } catch (error) {
          console.error('Error deleting group:', error);
          Modal.error({
            title: 'Error',
            content: 'Failed to delete the group. Please try again.',
          });
        }
      },
    });
  };

  const fetchGroupMembers = async (groupId: string) => {
    if (!groupId) return;
    
    setLoadingMembers(true);
    try {
      const response = await communicationInstance.get(`/communication-service/api/chat/get-all-groupmembers/${groupId}`);
      setGroupMembers(response.data);
    } catch (error) {
      console.error('Error fetching group members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleViewMembers = () => {
    if (selectedTarget?.type === 'group' && selectedTarget.id) {
      fetchGroupMembers(selectedTarget.id);
      setIsGroupMembersModalOpen(true);
    }
  };

  const handleGroupUpdate = async () => {
    try {
      // Fetch updated groups
      const groupsResponse = await communicationInstance.get('/communication-service/api/chat/get-all-groups');
      if (groupsResponse.data) {
        setGroups(groupsResponse.data);
      }

      // Update selected target if it's the modified group
      if (selectedTarget?.type === 'group' && selectedTarget?.id) {
        const updatedGroupResponse = await communicationInstance.get(`/communication-service/api/chat/get-group-detailes/${selectedTarget.id}`);
        const updatedGroup = updatedGroupResponse.data;
        
        setSelectedTarget(prev => prev ? {
          ...prev,
          name: updatedGroup.groupName,
          receiverId: updatedGroup.participants.map((p: GroupMember) => p.id),
          chatId: updatedGroup._id,
          id: updatedGroup._id
        } : null);
      }
    } catch (error) {
      console.error('Error updating group details:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const groupsResponse = await communicationInstance.get('/communication-service/api/chat/get-all-groups');
      if (groupsResponse.data) {
        setGroups(groupsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const employeesResponse = await communicationInstance.get('/communication-service/api/chat/get-all-chats', {
          signal: controller.signal
        });
        
        if (employeesResponse.data && isMounted) {
          setEmployees(employeesResponse.data);
          const firstEmployee = employeesResponse.data[0];
          setSelectedTarget({
            chatId: firstEmployee.chatId,
            senderId: firstEmployee.senderId,
            receiverId: [firstEmployee.receiverId],
            name: firstEmployee.receiverName,
            avatar: firstEmployee.receiverProfilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png",
            status: firstEmployee.status,
            id: firstEmployee.chatId,
            type: 'private',
          });
        }
  
        await fetchGroups();
        
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching data:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setSiderVisible(!mobile);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const slideVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <Layout style={{ minHeight: '86vh' }}>
      <AnimatePresence mode="wait">
        {isMobile ? (
          <Drawer
            key="mobile-drawer"
            placement="left"
            open={siderVisible}
            onClose={() => setSiderVisible(false)}
            width="100%"
            bodyStyle={{ padding: 0 }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ChatPeoples
                  employees={employees}
                  groups={groups}
                  setSelectedTarget={setSelectedTarget}
                  isMobile={isMobile}
                  setSiderVisible={setSiderVisible}
                  formatLastSeen={formatLastSeen}
                  refreshGroups={fetchGroups}
                />
              </motion.div>
            )}
          </Drawer>
        ) : (
          <Sider width={300} style={{ overflowY: 'auto', backgroundColor: '#fff' }}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ChatPeoples
                  employees={employees}
                  groups={groups}
                  setSelectedTarget={setSelectedTarget}
                  isMobile={isMobile}
                  setSiderVisible={setSiderVisible}
                  formatLastSeen={formatLastSeen}
                  refreshGroups={fetchGroups}
                />
              </motion.div>
            )}
          </Sider>
        )}
      </AnimatePresence>

      <Layout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
          transition={{ duration: 0.3 }}
        >
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              backgroundColor: themeColor,
              color: '#fff',
            }}
          >
            {selectedTarget && (
              <motion.div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Badge dot={selectedTarget.type === 'private' ? selectedTarget.status : undefined}>
                    {selectedTarget.avatar ? (
                      <Avatar src={selectedTarget.avatar} size={40} />
                    ) : (
                      <Avatar size={40}>{selectedTarget.name.charAt(0)}</Avatar>
                    )}
                  </Badge>
                  <Badge style={{ marginLeft: 16 }}>
                    <div className='font-semibold' style={{ fontSize: '16px', color: '#fff' }}>{selectedTarget.name}</div>
                    {selectedTarget.type === 'group' && (
                      <div style={{ fontSize: '12px', color: '#fff' }}>Group Chat</div>
                    )}
                  </Badge>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedTarget.type === 'group' && (
                    <>
                      <Button
                        icon={<TeamOutlined />}
                        onClick={handleViewMembers}
                        type="default"
                        ghost
                      >
                        View Members
                      </Button>
                      {!isEmployee && (
                        <>
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => setIsEditGroupModalOpen(true)}
                            type="default"
                            ghost
                          >
                            Edit Group
                          </Button>
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteGroup(selectedTarget.id)}
                            type="default"
                            danger
                            ghost
                          >
                            Delete Group
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  {isMobile && (
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button icon={<MenuOutlined />} onClick={() => setSiderVisible(true)} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </Header>
        </motion.div>

        <Content
          style={{
            padding: 16,
            overflowY: 'auto',
            backgroundColor: '#fff',
          }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : selectedTarget ? (
              <motion.div
                key="chat-window"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                transition={{ duration: 0.3 }}
              >
                <ChatWindow
                 senderName={senderName}
                  chatId={selectedTarget.chatId || ''}
                  senderId={selectedTarget.senderId}
                  targetId={selectedTarget.receiverId}
                  targetType={selectedTarget.type}
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  showEmojiPicker={showEmojiPicker}
                  setShowEmojiPicker={setShowEmojiPicker}
                  scrollToBottom={() => {}}
                />
              </motion.div>
            ) : (
              <motion.div
                key="no-target"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center' }}
              >
                Please select a user or group to start chatting.
              </motion.div>
            )}
          </AnimatePresence>
        </Content>

        <GroupMembersModal
          isOpen={isGroupMembersModalOpen}
          onClose={() => setIsGroupMembersModalOpen(false)}
          groupId={selectedTarget?.id || ''}
          loading={loadingMembers}
          members={groupMembers}
        />

<EditGroupModal
        isOpen={isEditGroupModalOpen}
        onClose={() => setIsEditGroupModalOpen(false)}
        groupId={selectedTarget?.id || ''}
        onGroupUpdate={handleGroupUpdate}
        setGroups={setGroups}  // Pass setGroups to EditGroupModal
        currentGroup={groups.find(g => g.groupId === selectedTarget?.id)}
      />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, List, Avatar, Spin, message, Divider } from 'antd';
import { DeleteOutlined, UserAddOutlined} from '@ant-design/icons';
import { communicationInstance } from '../../services/communicationInstance';


export interface Group {
  senderId: string;
  groupId: string;
  groupName: string;
  participants: string[];
  lastMessage: string;
  timestamp: Date;
  avatar?: string;

}
interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onGroupUpdate: () => void;
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  currentGroup: Group | undefined;
}

interface GroupMember {
  _id: string;
  name: string;
  profilePicture?: string;
  position: string;
}

interface GroupDetails {
  _id: string;
  groupName: string;
  participants: GroupMember[];
  chatType: string;
  groupAdmin: string;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  groupId,
  onGroupUpdate,
  setGroups,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [newGroupDetails, setNewGroupDetails] = useState<GroupDetails | null>(null);
  const [availableMembers, setAvailableMembers] = useState<GroupMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [removedMembers, setRemovedMembers] = useState<string[]>([]);

  const fetchGroupDetails = async () => {
    if (!groupId) return;
    
    setLoading(true);
    try {
      const response = await communicationInstance.get(`/communication-service/api/chat/get-group-detailes/${groupId}`);
      setGroupDetails(response.data);
      setNewGroupDetails(response.data); // Initialize newGroupDetails with current details
      form.setFieldsValue({ name: response.data.groupName });
    } catch (error) {
      console.error('Error fetching group details:', error);
      message.error('Failed to fetch group details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMembers = async () => {
    if (!groupId) return;

    try {
      const response = await communicationInstance.get(`/communication-service/api/chat/unadded-users/${groupId}`);
      setAvailableMembers(response.data);
    } catch (error) {
      console.error('Error fetching available members:', error);
      message.error('Failed to fetch available members');
    }
  };

  useEffect(() => {
    if (isOpen && groupId) {
      fetchGroupDetails();
      fetchAvailableMembers();
      setSelectedMembers([]);
      setRemovedMembers([]);
    }
  }, [isOpen, groupId]);

  const handleRemoveMember = (memberId: string) => {
    if (!newGroupDetails) return;

    if (memberId === newGroupDetails.groupAdmin) {
      message.warning('Cannot remove the group admin');
      return;
    }

    setRemovedMembers([...removedMembers, memberId]);
    const updatedParticipants = newGroupDetails.participants.filter(
      member => member._id !== memberId
    );
    setNewGroupDetails({
      ...newGroupDetails,
      participants: updatedParticipants
    });
  };

  const handleAddMember = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers([...selectedMembers, memberId]);
      
      const memberToAdd = availableMembers.find(member => member._id === memberId);
      if (memberToAdd && newGroupDetails) {
        setNewGroupDetails({
          ...newGroupDetails,
          participants: [...newGroupDetails.participants, memberToAdd]
        });
      }
      
      setAvailableMembers(prevMembers => 
        prevMembers.filter(member => member._id !== memberId)
      );
    }
  };

  const handleUndoAddMember = (memberId: string) => {
    setSelectedMembers(prevSelected => 
      prevSelected.filter(_id => _id !== memberId)
    );
    
    if (newGroupDetails) {
      const updatedParticipants = newGroupDetails.participants.filter(
        member => member._id !== memberId
      );
      setNewGroupDetails({
        ...newGroupDetails,
        participants: updatedParticipants
      });
    }
    
    const memberToAdd = availableMembers.find(member => member._id === memberId);
    if (memberToAdd) {
      setAvailableMembers(prev => [...prev, memberToAdd]);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const currentMemberIds = newGroupDetails?.participants
        .filter(member => !removedMembers.includes(member._id))
        .map(member => member._id) || [];

      const updatedGroupData = {
        groupName: values.name,
        participants: [...currentMemberIds, ...selectedMembers],
        removedMembers: removedMembers
      };

      const response = await communicationInstance.patch(`/communication-service/api/chat/update-group/${groupId}`, updatedGroupData);
      
      // Update the newGroupDetails with the response data
      setNewGroupDetails({
        ...newGroupDetails!,
        groupName: values.name,
        participants: response.data.participants || newGroupDetails!.participants
      });

      // Update the groups list in the parent component
      setGroups(prevGroups => prevGroups.map(group => {
        if (group.groupId === groupId) {
          return {
            ...group,
            groupName: values.name,
            participants: response.data.participants.map((p: GroupMember) => p._id)
          };
        }
        return group;
      }));

      message.success('Group updated successfully');
      onGroupUpdate(); // This will trigger the parent's handleGroupUpdate
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ValidationError') {
        message.error('Please check all required fields');
      } else {
        console.error('Error updating group:', error);
        message.error('Failed to update group');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedMembers([]);
    setRemovedMembers([]);
    setNewGroupDetails(groupDetails); // Reset to original group details
    onClose();
  };

  // Add the return statement with your JSX here
  return (
    <Modal
      title="Edit Group"
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Save Changes
        </Button>
      ]}
      width={600}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input />
          </Form.Item>

          <Divider>Current Members</Divider>
          <List
            dataSource={newGroupDetails?.participants || []}
            renderItem={(member: GroupMember) => (
              <List.Item
                actions={[
                  member._id !== newGroupDetails?.groupAdmin && (
                    <DeleteOutlined
                      onClick={() => handleRemoveMember(member._id)}
                      style={{ color: 'red' }}
                    />
                  )
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={member.profilePicture} />}
                  title={member.name}
                  description={member._id === newGroupDetails?.groupAdmin ? 'Admin' : member.position}
                />
              </List.Item>
            )}
          />

          <Divider>Available Members</Divider>
          <List
            dataSource={availableMembers}
            renderItem={(member: GroupMember) => (
              <List.Item
                actions={[
                  <UserAddOutlined
                    onClick={() => handleAddMember(member._id)}
                    style={{ color: 'green' }}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={member.profilePicture} />}
                  title={member.name}
                  description={member.position}
                />
              </List.Item>
            )}
          />

          {selectedMembers.length > 0 && (
            <>
              <Divider>Selected Members to Add</Divider>
              <List
                dataSource={selectedMembers}
                renderItem={(memberId: string) => {
                  const member = availableMembers.find(m => m._id === memberId);
                  return (
                    member && (
                      <List.Item
                        actions={[
                          <DeleteOutlined
                            onClick={() => handleUndoAddMember(memberId)}
                            style={{ color: 'red' }}
                          />
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={member.profilePicture} />}
                          title={member.name}
                          description={member.position}
                        />
                      </List.Item>
                    )
                  );
                }}
              />
            </>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditGroupModal;
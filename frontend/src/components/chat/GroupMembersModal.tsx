import React from 'react';
import { Avatar, Skeleton, Modal, List } from 'antd';



interface GroupMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    loading: boolean;
    members: GroupMember[];
  }

  interface GroupMember {
    id: string;
    name: string;
    profilePicture?: string;
    position: string;
  }
  
 const GroupMembersModal: React.FC<GroupMembersModalProps> = ({
    isOpen,
    onClose,
    loading,
    members
  }) => {
    return (
      <Modal
        title="Group Members"
        open={isOpen}
        onCancel={onClose}
        footer={null}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={members}
            renderItem={member => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={member.profilePicture} 
                      size={40}
                    >
                      {!member.profilePicture && member.name.charAt(0)}
                    </Avatar>
                  }
                  title={member.name}
                  description={member.position}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    );
  };

  export default GroupMembersModal;
import React from 'react';
import { Card, Avatar, Tag, Checkbox } from 'antd';

interface TeamCardProps {
  member: { id: number; name: string; position: string; online: boolean; active: boolean };
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, isSelected, onSelect }) => (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Checkbox checked={isSelected} onChange={() => onSelect(member.id)} />
          <Avatar>{member.name.charAt(0)}</Avatar>
          <span className="truncate">{member.name}</span>
        </div>
      }
      className="hover:shadow-lg transition-all"
      extra={<Tag color={member.online ? 'green' : 'red'}>{member.online ? 'Online' : 'Offline'}</Tag>}
    >
      <p>Position: {member.position}</p>
      <p>Status: {member.active ? 'Active' : 'Inactive'}</p>
      <div className="flex justify-around mt-4">
        {/* Add buttons */}
      </div>
    </Card>
  );
  

export default TeamCard;

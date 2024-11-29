import React, { useState } from 'react';
import { Input, List, Button } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import useTheme from '../../hooks/useTheme';
import TeamCard from '../global/TeamCard';
import ProjectStats from '../global/ProjectStat';
import ScheduleMeeting from '../global/ScheduleMeeting';

const teamMembers = [
  { id: 1, name: 'Alice Johnson', position: 'Team Lead', online: true, active: true },
  { id: 2, name: 'Bob Smith', position: 'Developer', online: false, active: false },
  { id: 3, name: 'Cathy Brown', position: 'Designer', online: true, active: true },
  { id: 4, name: 'David Wilson', position: 'QA Engineer', online: false, active: true },
];

const Team: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { themeColor, isActiveMenu } = useTheme();

  const filteredTeam = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { title: 'Total Team Members', value: teamMembers.length },
    { title: 'Online Members', value: teamMembers.filter((member) => member.online).length },
    { title: 'Active Members', value: teamMembers.filter((member) => member.active).length },
  ];

  const handleSelect = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={`p-4 transition-all duration-300 '}` }
      style={{
        color: themeColor,
        marginLeft: isActiveMenu ? '20px' : '0',
      }}
    >
      <h1 className="text-2xl mb-4" style={{ color: themeColor }}>
        Team
      </h1>

      {/* Search Input */}
      <Input
        placeholder="Search team members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {/* Project Statistics */}
      <ProjectStats stats={stats}  />

      {/* Team Member List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={filteredTeam}
          renderItem={(member) => (
            <List.Item>
              <TeamCard
                member={member}
                isSelected={selectedMembers.includes(member.id)}
                onSelect={handleSelect}
              />
            </List.Item>
          )}
        />
      </motion.div>

      {/* Schedule Meeting Button */}
      <div className="mt-4">
        <Button
          type="primary"
          icon={<CalendarOutlined />}
          onClick={() => setIsModalOpen(true)}
          disabled={selectedMembers.length === 0}
        >
          Schedule Meeting
        </Button>
      </div>

      {/* Schedule Meeting Modal */}
      <ScheduleMeeting
        visible={isModalOpen}
        onOk={(values) => {
          console.log('Meeting Scheduled:', values);
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
        participants={teamMembers.filter((member) => selectedMembers.includes(member.id))}
      />
    </div>
  );
};

export default Team;

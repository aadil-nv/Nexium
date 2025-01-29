// components/ProjectStats.tsx
import React from 'react';
import { Card } from 'antd';

interface ProjectStatsProps {
  stats: { title: string; value: number }[];
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ stats }) => {
  return (
    <div className="flex gap-4 flex-wrap pb-8">
      {stats.map((stat, index) => (
        <Card key={index} title={stat.title} bordered={false} style={{ minWidth: '120px' }}>
          {stat.value}
        </Card>
      ))}
    </div>
  );
};

export default ProjectStats;

import React from 'react';
import { Card, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface CardImageProps {
  title: string;
  imgSrc: string;
}

const CardImage: React.FC<CardImageProps> = ({ title, imgSrc }) => (
  <Card
    hoverable
    className="mb-2 flex flex-col items-center pt-4 h-[40%]"
    cover={
      <div className="relative">
        <img
          src={imgSrc}
          alt={title}
          className="w-24 h-24 rounded-full object-cover mx-auto"
        />
        <Button
          icon={<EditOutlined />}
          shape="circle"
          size="large"
          className="absolute bottom-0 right-0"
          style={{ borderColor: 'white', backgroundColor: 'white' }}
        />
      </div>
    }
  >
    <h3 className="text-center">{title}</h3>
  </Card>
);

export default CardImage;

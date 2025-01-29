import React from 'react';
import { Button, Empty, Typography } from 'antd';

const EmptyData: React.FC = () => (
  <div className="">
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={
        <Typography.Text>
          Customize <a href="#API">Description</a>
        </Typography.Text>
      }
    >
      <Button type="primary">Create Now</Button>
    </Empty>
  </div>
);

export default EmptyData;

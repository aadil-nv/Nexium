import React from 'react';
import { Tabs } from 'antd'; // Import Ant Design's Tabs component
import PersonalDetailes from './PersonalDetailes'; // Your personal details component
import Documents from './Documents'; // Your documents component
import Address from './Address'; // Your address component
import Securitie from './Securitie'; // Your securities component

const { TabPane } = Tabs;

export default function Profile() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Tabs 
        defaultActiveKey="1" 
        centered
        tabBarStyle={{
          fontSize: '16px', // Default font size
          padding: '0 20px',
        }}
      >
        <TabPane tab="Personal Details" key="1">
          <PersonalDetailes />
        </TabPane>
        <TabPane tab="Address" key="2">
          <Address />
        </TabPane>
        <TabPane tab="Documents" key="3">
          <Documents />
        </TabPane>
        <TabPane tab="Professional Details" key="4">
          <Securitie />
        </TabPane>
      </Tabs>

      {/* Mobile styling */}
      <style>
        {`
          @media (max-width: 768px) {
            .ant-tabs-tab {
              font-size: 12px; /* Reduce font size for mobile */
              padding: 8px 12px; /* Adjust padding */
            }
            .ant-tabs {
              font-size: 12px;
            }
          }
        `}
      </style>
    </div>
  );
}

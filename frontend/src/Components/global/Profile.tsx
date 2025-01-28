import  { useState } from 'react';
import { Tabs } from 'antd';
import { businessOwnerTabs, managerTabs, employeeTabs } from "../../utils/centralPaths";
import useAuth from '../../hooks/useAuth';

const { TabPane } = Tabs;

export default function Profile() {
  const [activeKey, setActiveKey] = useState("1");
  const { businessOwner, manager, employee } = useAuth();
  
  const tabsToShow = businessOwner.isAuthenticated ? businessOwnerTabs :
                     manager.isAuthenticated ? managerTabs :
                     employee.isAuthenticated ? employeeTabs : [];

                     console.log("tabsToShow", tabsToShow);
                     

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Tabs activeKey={activeKey} onChange={setActiveKey} defaultActiveKey="1" centered tabBarStyle={{ fontSize: 16, padding: '0 20px' }}>
        {tabsToShow.map(({ key, tab, component }) => (
          <TabPane tab={tab} key={key}>{component}</TabPane>
        ))}
      </Tabs>

      <style>{`
        .ant-tabs-tab { color: red; }
        .ant-tabs-tab-active { color: red; font-weight: bold; }
        @media (max-width: 768px) { .ant-tabs-tab { font-size: 12px; padding: 8px 12px; } }
      `}</style>
    </div>
  );
}

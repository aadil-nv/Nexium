import React, { useState, useEffect } from 'react';
import { Button, Input, List, Space, Switch, Form, Card } from 'antd';
import { PercentageOutlined, MoneyCollectOutlined, SlidersOutlined } from '@ant-design/icons';
import useTheme from '../../../hooks/useTheme';
import { managerInstance } from '../../../services/managerInstance';

interface Setting {
  id: number;
  name: string;
  type: 'allowance' | 'deduction' | 'other' | 'incentive' |'payDay';
  amount?: number;
  overtimeEnabled?: boolean;
}

interface IncentiveSlab {
  id: number;
  _id: string; // Add _id field to IncentiveSlab
  name: string;
  minTaskCount: number;
  maxTaskCount: number;
  amount: number;
}

interface PayrollData {
  _id: string;
  allowances: {
    bonus: number;
    gratuity: number;
    medicalAllowance: number;
    hra: number;
    da: number;
    overTime: {
      type: number;
      overtimeEnabled: boolean;
    };
  };
  deductions: {
    incomeTax: number;
    providentFund: number;
    professionalTax: number;
    esiFund: number;
  };
  incentives: {
    _id: string;
    incentiveName: string;
    minTaskCount: number;
    maxTaskCount: number;
    percentage: number;
  }[];
  payDay:number
  createdAt: string;
}

const PayrollSettings = () => {
  const { themeColor } = useTheme();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [data, setData] = useState<PayrollData[]>([]);
  const [incentiveSlabs, setIncentiveSlabs] = useState<IncentiveSlab[]>([]);

  // Fetch data from API
  useEffect(() => {
    managerInstance.get('/manager/api/payroll/get-all-payroll-crieteria')
      .then(response => {
        const payrollData = response.data[0]; // Assuming the data is an array, access the first object
        setData(response.data);

        // Map the fetched data into the settings and slabs
        if (payrollData) {
          const mappedSettings: Setting[] = [
            { id: 1, name: 'Pay Day', type: 'payDay', amount: payrollData.payDay },
            { id: 2, name: 'Bonus', type: 'allowance', amount: payrollData.allowances?.bonus },
            { id: 3, name: 'Gratuity', type: 'allowance', amount: payrollData.allowances?.gratuity },
            { id: 4, name: 'Medical Allowance', type: 'allowance', amount: payrollData.allowances?.medicalAllowance },
            { id: 5, name: 'HRA', type: 'allowance', amount: payrollData.allowances?.hra },
            { id: 6, name: 'DA', type: 'allowance', amount: payrollData.allowances?.da },
            { id: 7, name: 'Income Tax', type: 'deduction', amount: payrollData.deductions?.incomeTax },
            { id: 8, name: 'Provident Fund', type: 'deduction', amount: payrollData.deductions?.providentFund },
            { id: 9, name: 'Professional Tax', type: 'deduction', amount: payrollData.deductions?.professionalTax },
            { id: 10, name: 'ESI Fund', type: 'deduction', amount: payrollData.deductions?.esiFund },
            { id:  11, name: 'Overtime Incentive', type: 'other', amount: payrollData.allowances?.overTime.type, overtimeEnabled: payrollData.allowances?.overTime.overtimeEnabled },

          ];

          const mappedIncentiveSlabs: IncentiveSlab[] = payrollData.incentives?.map((incentive: any, index: number) => ({
            id: index + 1,
            _id: incentive._id,  // Add _id field here
            name: incentive.incentiveName,
            minTaskCount: incentive.minTaskCount,
            maxTaskCount: incentive.maxTaskCount,
            amount: incentive.percentage,
          })) || [];

          setSettings(mappedSettings);
          setIncentiveSlabs(mappedIncentiveSlabs);
        }
      })
      .catch(error => {
        console.error("Error fetching payroll criteria:", error);
      });
  }, []);
  
  const updateSetting = (id: number, key: keyof Setting, value: any) => {
    setSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const saveSettings = () => {
    // Prepare the data for the API request
    const payload = {
      _id: data[0]?._id,
      allowances: {
        bonus: settings.find(item => item.name === 'Bonus')?.amount,
        gratuity: settings.find(item => item.name === 'Gratuity')?.amount,
        medicalAllowance: settings.find(item => item.name === 'Medical Allowance')?.amount,
        hra: settings.find(item => item.name === 'HRA')?.amount,
        da: settings.find(item => item.name === 'DA')?.amount,
        overTime: {
          type: settings.find(item => item.name === 'Overtime Incentive')?.amount,
          overtimeEnabled: settings.find(item => item.name === 'Overtime Incentive')?.overtimeEnabled,
        },
      },
      deductions: {
        incomeTax: settings.find(item => item.name === 'Income Tax')?.amount,
        providentFund: settings.find(item => item.name === 'Provident Fund')?.amount,
        professionalTax: settings.find(item => item.name === 'Professional Tax')?.amount,
        esiFund: settings.find(item => item.name === 'ESI Fund')?.amount,
      },
      incentives: incentiveSlabs.map(slab => ({
        incentiveName: slab.name,
        minTaskCount: slab.minTaskCount,
        maxTaskCount: slab.maxTaskCount,
        percentage: slab.amount,
      })),
      payDay: settings.find(item => item.name === 'Pay Day')?.amount
    };

    managerInstance.post(`/manager/api/payroll/update-payroll-crieteria/${data[0]?._id}`, payload)
      .then(response => {
        console.log('Payroll criteria updated:', response.data);
        alert('Settings have been saved successfully!');
      })
      .catch(error => {
        console.error('Error updating payroll criteria:', error);
        alert('There was an error saving the settings.');
      });
  };

  const addIncentiveSlab = () => {
    const newSlab = {
      id: incentiveSlabs.length + 1,
      _id: '',  // Add _id as an empty string or null initially
      name: '',
      minTaskCount: 0,
      maxTaskCount: 0,
      amount: 0,
    };
    setIncentiveSlabs([...incentiveSlabs, newSlab]);
  };
  

  const removeIncentiveSlab = (id: number, _id: string) => {
    const payrollCriteriaId = data[0]?._id;
  
    if (!payrollCriteriaId) {
      alert('Payroll Criteria ID is missing!');
      return;
    }
  
    // Prepare data to send to the API
    const requestData = {
      payrollCriteriaId,  // Add payrollCriteriaId here
    };
  
    managerInstance.patch(`/manager/api/payroll/delete-incentive/${_id}`, requestData)
      .then(response => {
        setIncentiveSlabs(incentiveSlabs.filter((slab) => slab.id !== id));
        alert('Incentive Slab removed successfully!');
      })
      .catch(error => {
        console.error("Error removing incentive slab:", error);
        alert('There was an error removing the incentive slab.');
      });
  };
  

  const updateIncentiveSlab = (id: number, key: keyof IncentiveSlab, value: any) => {
    setIncentiveSlabs((prev) =>
      prev.map((slab) => (slab.id === id ? { ...slab, [key]: value } : slab))
    );
  };

  const renderList = (type: Setting['type'], title: string) => (
    <>
      <h2 className="text-2xl font-semibold mb-4" style={{ color: themeColor }}>{title}</h2>
      <List
        bordered
        dataSource={settings.filter((item) => item.type === type)}
        renderItem={(item) => (
          <List.Item
            actions={[ 
              <Input
                type="number"
                min={0}
                value={item.amount}
                onChange={(e) => updateSetting(item.id, 'amount', Number(e.target.value))}
                style={{ width: '120px' }}
                placeholder="Amount"
              />,
              item.type === 'other' && (
                <Space>
                  <span>Overtime Incentive:</span>
                  <Switch
                    checked={item.overtimeEnabled}
                    onChange={(checked) => updateSetting(item.id, 'overtimeEnabled', checked)}
                  />
                </Space>
              ),
            ].filter(Boolean)}
          >
            {item.name}
          </List.Item>
        )}
      />
    </>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6" style={{ color: themeColor }}>Payroll Settings</h1>
      {renderList('payDay', 'Pay Day')}
      {renderList('allowance', 'Allowances')}
      {renderList('deduction', 'Deductions')}
      {renderList('other', 'Other')}
      
      {/* Incentive Slabs Section with different style */}
      <h2 className="text-2xl font-semibold mb-4" style={{ color: themeColor }}>Incentive Slabs</h2>
      <List
        bordered
        dataSource={incentiveSlabs}
        renderItem={(slab) => (
          <List.Item
            actions={[
              <Button
                style={{color:"red"}}
                onClick={() => removeIncentiveSlab(slab.id, slab._id)}
                icon={<SlidersOutlined />}
              >
                Remove
              </Button>,
            ]}
          >
            <Space direction="vertical">
              <Input
                value={slab.name}
                onChange={(e) => updateIncentiveSlab(slab.id, 'name', e.target.value)}
                placeholder="Slab Name"
              />
              <Space>
                <Input
                  type="number"
                  value={slab.minTaskCount}
                  onChange={(e) => updateIncentiveSlab(slab.id, 'minTaskCount', Number(e.target.value))}
                  placeholder="Min Task Count"
                />
                <Input
                  type="number"
                  value={slab.maxTaskCount}
                  onChange={(e) => updateIncentiveSlab(slab.id, 'maxTaskCount', Number(e.target.value))}
                  placeholder="Max Task Count"
                />
                <Input
                  type="number"
                  value={slab.amount}
                  onChange={(e) => updateIncentiveSlab(slab.id, 'amount', Number(e.target.value))}
                  placeholder="Amount"
                />
              </Space>
            </Space>
          </List.Item>
        )}
      />
      <Button
        type="dashed"
        onClick={addIncentiveSlab}
        icon={<MoneyCollectOutlined />}
        className="mt-4"
      >
        Add Incentive Slab
      </Button>
      
      <div className="mt-6">
        <Button onClick={saveSettings} type="primary">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default PayrollSettings;

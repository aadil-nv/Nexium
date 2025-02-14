import  { useState, useEffect } from 'react';
import { Button, Input, List, Space, Switch, message } from 'antd';
import { MoneyCollectOutlined, SlidersOutlined } from '@ant-design/icons';
import useTheme from '../../../hooks/useTheme';
import { businessOwnerInstance } from '../../../services/businessOwnerInstance';
import { AxiosResponse } from 'axios';

interface Allowances {
  bonus: number;
  gratuity: number;
  medicalAllowance: number;
  hra: number;
  da: number;
  ta: number;
  overTime: {
    type: number;
    overtimeEnabled: boolean;
  };
}

interface Deductions {
  incomeTax: number;
  providentFund: number;
  professionalTax: number;
  esiFund: number;
}

interface PayrollIncentive {
  _id: string;
  incentiveName: string;
  minTaskCount: number;
  maxTaskCount: number;
  percentage: number;
}

interface PayrollData {
  _id: string;
  allowances: Allowances;
  deductions: Deductions;
  incentives: PayrollIncentive[];
  payDay: number;
  createdAt: string;
}

interface Setting {
  id: number;
  name: string;
  type: 'allowance' | 'deduction' | 'other' | 'payDay';
  amount?: number;
  overtimeEnabled?: boolean;
}

interface IncentiveSlab {
  id: number;
  _id: string;
  name: string;
  minTaskCount: number;
  maxTaskCount: number;
  amount: number;
}

const BusinessOwnerPayrollPolicy: React.FC = () => {
  const { themeColor } = useTheme();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [data, setData] = useState<PayrollData[]>([]);
  const [incentiveSlabs, setIncentiveSlabs] = useState<IncentiveSlab[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    businessOwnerInstance.get<{ success: boolean; data: PayrollData[] }>('/businessOwner-service/api/business-owner/get-all-payroll-crieteria')
      .then((response: AxiosResponse<{ success: boolean; data: PayrollData[] }>) => {
        const payrollData = response.data.data[0];
        setData(response.data.data);

        if (payrollData) {
          const mappedSettings: Setting[] = [
            { id: 1, name: 'Pay Day', type: 'payDay', amount: payrollData.payDay },
            { id: 2, name: 'Bonus', type: 'allowance', amount: payrollData.allowances?.bonus },
            { id: 3, name: 'Gratuity', type: 'allowance', amount: payrollData.allowances?.gratuity },
            { id: 4, name: 'Medical Allowance', type: 'allowance', amount: payrollData.allowances?.medicalAllowance },
            { id: 5, name: 'HRA', type: 'allowance', amount: payrollData.allowances?.hra },
            { id: 6, name: 'DA', type: 'allowance', amount: payrollData.allowances?.da },
            { id: 7, name: 'TA', type: 'allowance', amount: payrollData.allowances?.ta },
            { id: 8, name: 'Income Tax', type: 'deduction', amount: payrollData.deductions?.incomeTax },
            { id: 9, name: 'Provident Fund', type: 'deduction', amount: payrollData.deductions?.providentFund },
            { id: 10, name: 'Professional Tax', type: 'deduction', amount: payrollData.deductions?.professionalTax },
            { id: 11, name: 'ESI Fund', type: 'deduction', amount: payrollData.deductions?.esiFund },
            { 
              id: 12, 
              name: 'Overtime Incentive', 
              type: 'other', 
              amount: payrollData.allowances?.overTime.type, 
              overtimeEnabled: payrollData.allowances?.overTime.overtimeEnabled 
            },
          ];

          const mappedIncentiveSlabs: IncentiveSlab[] = payrollData.incentives?.map((incentive, index) => ({
            id: index + 1,
            _id: incentive._id,
            name: incentive.incentiveName,
            minTaskCount: incentive.minTaskCount,
            maxTaskCount: incentive.maxTaskCount,
            amount: incentive.percentage,
          })) || [];

          setSettings(mappedSettings);
          setIncentiveSlabs(mappedIncentiveSlabs);
        }
      })
      .catch((error: Error) => {
        message.error("Error fetching payroll criteria");
        console.error("Error fetching payroll criteria:", error);
      });
  }, []);
  
  const validateSettings = (): boolean => {
    const payDay = settings.find(item => item.name === 'Pay Day')?.amount;
    if (payDay === undefined || payDay < 1 || payDay > 29) {
      message.error('Pay Day must be between 1 and 29');
      return false;
    }

    const validationItems = [
      'Bonus', 'Gratuity', 'Medical Allowance', 'HRA', 'DA', 'TA',
      'Income Tax', 'Provident Fund', 'Professional Tax', 'ESI Fund',
      'Overtime Incentive'
    ];

    for (const itemName of validationItems) {
      const item = settings.find(s => s.name === itemName);
      if (item?.amount !== undefined && item.amount > 100) {
        message.error(`${itemName} cannot exceed 100%`);
        return false;
      }
    }

    return true;
  };

  const updateSetting = (id: number, key: keyof Setting, value: Setting[keyof Setting]) => {
    setSettings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          setHasChanges(true);
          return { ...item, [key]: value };
        }
        return item;
      })
    );
  };

  const addIncentiveSlab = () => {
    const newSlab: IncentiveSlab = {
      id: incentiveSlabs.length + 1,
      _id: '',
      name: '',
      minTaskCount: 0,
      maxTaskCount: 0,
      amount: 0,
    };
    setIncentiveSlabs([...incentiveSlabs, newSlab]);
    setHasChanges(true);
  };

  const removeIncentiveSlab = (id: number, _id: string) => {
    const payrollCriteriaId = data[0]?._id;
  
    if (!payrollCriteriaId) {
      message.error('Payroll Criteria ID is missing');
      return;
    }
  
    const requestData = {
      payrollCriteriaId,
    };
  
    if (_id) {
      businessOwnerInstance.patch(`/businessOwner-service/api/business-owner/delete-incentive/${_id}`, requestData)
        .then(() => {
          setIncentiveSlabs(incentiveSlabs.filter((slab) => slab.id !== id));
          message.success('Incentive Slab removed successfully');
          setHasChanges(true);
        })
        .catch((error: Error) => {
          message.error('Error removing incentive slab');
          console.error("Error removing incentive slab:", error);
        });
    } else {
      // If the slab doesn't have an _id, it's a new unsaved slab
      setIncentiveSlabs(incentiveSlabs.filter((slab) => slab.id !== id));
      setHasChanges(true);
    }
  };

  const updateIncentiveSlab = (id: number, key: keyof IncentiveSlab, value: IncentiveSlab[keyof IncentiveSlab]) => {
    setIncentiveSlabs((prev) =>
      prev.map((slab) => {
        if (slab.id === id) {
          setHasChanges(true);
          return { ...slab, [key]: value };
        }
        return slab;
      })
    );
  };

  const saveSettings = () => {
    if (!hasChanges) {
      message.info('No changes to save');
      return;
    }

    if (!validateSettings()) {
      return;
    }

    const overtimeIncentive = settings.find(item => item.name === 'Overtime Incentive');
    
    const payload = {
      _id: data[0]?._id,
      allowances: {
        bonus: settings.find(item => item.name === 'Bonus')?.amount || 0,
        gratuity: settings.find(item => item.name === 'Gratuity')?.amount || 0,
        medicalAllowance: settings.find(item => item.name === 'Medical Allowance')?.amount || 0,
        hra: settings.find(item => item.name === 'HRA')?.amount || 0,
        da: settings.find(item => item.name === 'DA')?.amount || 0,
        ta: settings.find(item => item.name === 'TA')?.amount || 0,
        overTime: {
          type: overtimeIncentive?.amount || 0,
          overtimeEnabled: overtimeIncentive?.overtimeEnabled || false,
        },
      },
      deductions: {
        incomeTax: settings.find(item => item.name === 'Income Tax')?.amount || 0,
        providentFund: settings.find(item => item.name === 'Provident Fund')?.amount || 0,
        professionalTax: settings.find(item => item.name === 'Professional Tax')?.amount || 0,
        esiFund: settings.find(item => item.name === 'ESI Fund')?.amount || 0,
      },
      incentives: incentiveSlabs.map(slab => ({
        incentiveName: slab.name,
        minTaskCount: slab.minTaskCount,
        maxTaskCount: slab.maxTaskCount,
        percentage: slab.amount,
      })),
      payDay: settings.find(item => item.name === 'Pay Day')?.amount || 0
    };

    businessOwnerInstance.post<PayrollData>(`/businessOwner-service/api/business-owner/update-payroll-crieteria/${data[0]?._id}`, payload)
      .then(() => {
        message.success('Settings saved successfully');
        setHasChanges(false);
      })
      .catch((error: Error) => {
        message.error('Error saving settings');
        console.error('Error updating payroll criteria:', error);
      });
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
                key="amount"
                type="number"
                min={0}
                max={100}
                value={item.amount}
                onChange={(e) => updateSetting(item.id, 'amount', Number(e.target.value))}
                style={{ width: '120px' }}
                placeholder="Amount (%)"
              />,
              item.type === 'other' && (
                <Space key="overtime">
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
      
      <h2 className="text-2xl font-semibold mb-4" style={{ color: themeColor }}>Incentive Slabs</h2>
      <List
        bordered
        dataSource={incentiveSlabs}
        renderItem={(slab) => (
          <List.Item
            actions={[
              <Button
                key="remove"
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
                placeholder="Incentive Slab Name"
              />
              <Space>
                <Input
                  type="number"
                  value={slab.minTaskCount}
                  onChange={(e) => updateIncentiveSlab(slab.id, 'minTaskCount', Number(e.target.value))}
                  placeholder="Min Tasks"
                />
                <Input
                  type="number"
                  value={slab.maxTaskCount}
                  onChange={(e) => updateIncentiveSlab(slab.id, 'maxTaskCount', Number(e.target.value))}
                  placeholder="Max Tasks"
                />
                <Input
                  type="number"
                  value={slab.amount}
                  onChange={(e) => updateIncentiveSlab(slab.id, 'amount', Number(e.target.value))}
                  placeholder="Percentage (%)"
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
        <Button 
          onClick={saveSettings} 
          type="primary"
          disabled={!hasChanges}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default BusinessOwnerPayrollPolicy;
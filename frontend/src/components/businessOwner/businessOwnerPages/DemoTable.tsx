import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';

const DemoTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      { key: '1', month: 'January', date: '2024-01-15', paymentVia: 'Credit Card', plan: 'Premium', downloadLink: 'https://example.com/file1.pdf' },
      { key: '2', month: 'February', date: '2024-02-20', paymentVia: 'PayPal', plan: 'Basic', downloadLink: 'https://example.com/file2.pdf' },
    ]);
  }, []);

  const columns = ['Month', 'Date', 'Payment Via', 'Plan', 'Download'].map((title) => ({
    title,
    dataIndex: title.toLowerCase().replace(' ', ''),
    key: title.toLowerCase().replace(' ', ''),
    render: title === 'Download' ? (text: any, record: any) => <Button type="primary" href={record.downloadLink} target="_blank" download>Download</Button> : undefined,
  }));

  return (
    <div>
      <h1 className="text-2xl text-red-800">DemoTable</h1>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} scroll={{ x: 800 }} />
    </div>
  );
};

export default DemoTable;

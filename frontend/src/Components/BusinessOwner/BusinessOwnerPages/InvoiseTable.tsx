import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { fetchInvoices } from '../../../api/businessOwnerApi';
import { Invoice, DemoTableProps } from "../../../interface/BusinessOwnerInterface";

const DemoTable: React.FC<DemoTableProps> = ({ invoiceData: propInvoiceData }) => {
  const [data, setData] = useState<Invoice[]>([]);

  useEffect(() => {
    if (propInvoiceData) {
      setData(propInvoiceData);
    } else {
      fetchInvoices()
        .then((data) => setData(data))
        .catch(console.error);
    }
  }, [propInvoiceData]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      render: (text: number) => {
        const date = new Date(text * 1000);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      }
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amount_paid',
      key: 'amount_paid',
      render: (text: number) => text.toFixed(2).replace(/\.00$/, '')
    },
    {
      title: 'Amount Due',
      dataIndex: 'amount_due',
      key: 'amount_due',
      render: (text: number) => text.toFixed(2).replace(/\.00$/, '')
    },
    {
      title: 'Download',
      key: 'download',
      render: (_text: string, record: Invoice) => (
        <Button type="primary" href={record.invoice_pdf} target="_blank" download>
          Download
        </Button>
      )
    }
  ];

  return (
    <div>
      <h1 className="text-2xl text-red-800">Payment History</h1>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} scroll={{ x: 800 }} />
    </div>
  );
};

export default DemoTable;
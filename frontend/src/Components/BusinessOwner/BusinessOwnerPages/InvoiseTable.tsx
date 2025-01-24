import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { businessOwnerInstance } from '../../../services/businessOwnerInstance';

interface Invoice {
  id: string;
  created: number;
  amount_paid: number;
  amount_due: number;
  invoice_pdf: string;
}

interface DemoTableProps {
  invoiceData?: Invoice[];
}

const DemoTable: React.FC<DemoTableProps> = ({ invoiceData: propInvoiceData }) => {
  const [data, setData] = useState<Invoice[]>([]);

  useEffect(() => {

    if (propInvoiceData) {
      setData(propInvoiceData);
    } else {
      businessOwnerInstance
        .get('/businessOwner/api/subscription/invoices')
        .then((response) => setData(response.data))
        .catch(console.error);
    }
  }, [propInvoiceData]);

  const columns = ['id', 'created', 'amount_paid', 'amount_due', 'Download'].map((title) => ({
    title,
    dataIndex: title.toLowerCase().replace(' ', ''), // Set data index
    key: title.toLowerCase().replace(' ', ''),      // Set key
    render: title === 'Download'
      ? (text: string, record: Invoice) => (
          <Button type="primary" href={record.invoice_pdf} target="_blank" download>
            Download
          </Button>
        )
      : title === 'created'
      ? (text: string) => {
          // Convert 'created' timestamp to human-readable date
          const timestamp = parseInt(text, 10); // Ensure the timestamp is a number
          const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        }
      : ['amount_paid', 'amount_due'].includes(title.toLowerCase())
      ? (text: string) => parseFloat(text).toFixed(2).replace(/\.00$/, '') // Format and remove trailing `.00`
      : undefined, // Use default render otherwise
  }));

  return (
    <div>
      <h1 className="text-2xl text-red-800">Payment History</h1>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} scroll={{ x: 800 }} />
    </div>
  );
};

export default DemoTable;
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { fetchInvoices } from '../../../api/businessOwnerApi';
import {Invoice, DemoTableProps} from "../../../interface/BusinessOwnerInterface";



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
      ? (text: string) => parseFloat(text).toFixed(2).replace(/\.00$/, '') 
      : undefined, 
  }));

  return (
    <div>
      <h1 className="text-2xl text-red-800">Payment History</h1>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} scroll={{ x: 800 }} />
    </div>
  );
};

export default DemoTable;

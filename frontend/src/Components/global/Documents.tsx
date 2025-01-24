import React, { useState, useEffect } from 'react';
import { Button, Upload, Card, Skeleton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { motion } from 'framer-motion';

import useAuth from '../../hooks/useAuth';
import { fetchBusinessOwnerDocument, uploadBuisnessOwnerDocument } from "../../api/businessOwnerApi";
import { fetchManagerDocument, updateManagerOwnerDocument } from "../../api/managerApi";
import { fetchEmployeeDocument, updateEmployeeDocument } from "../../api/employeeApi";

interface Document {
  documentName: string;
  documentSize: string;
  uploadedAt: string;
  documentUrl?: string;
}

const Documents: React.FC = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const { businessOwner, manager, employee } = useAuth();

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        let data: Document | null = null;
        if (businessOwner.isAuthenticated) {
          data = await fetchBusinessOwnerDocument();
        } else if (manager.isAuthenticated) {
          data = await fetchManagerDocument();
        } else if (employee.isAuthenticated) {
          data = await fetchEmployeeDocument();
        }
        setDocument(data);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [businessOwner.isAuthenticated, manager.isAuthenticated, employee.isAuthenticated]);

  const handleUpload = async (info: UploadChangeParam<UploadFile>) => {
    const { file } = info;
    setLoading(true);
    const castedFile = file as unknown as File;

    try {
      let updatedDocument: Document | null = null;
      if (businessOwner.isAuthenticated) {
        await uploadBuisnessOwnerDocument(castedFile);
        updatedDocument = await fetchBusinessOwnerDocument();
      } else if (manager.isAuthenticated) {
        await updateManagerOwnerDocument(castedFile);
        updatedDocument = await fetchManagerDocument();
      } else if (employee.isAuthenticated) {
        await updateEmployeeDocument(castedFile);
        updatedDocument = await fetchEmployeeDocument();
      }
      setDocument(updatedDocument);
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      className="document-card p-4 border border-gray-300 rounded-lg max-w-full mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full"
        layout
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
      >
        <Card
          title={document ? document.documentName : 'Upload Document'}
          bordered={false}
        >
          {loading ? (
            <Skeleton active />
          ) : document ? (
            <>
              <div className="flex flex-col">
                <p>Size: {document.documentSize}</p>
                <p>Uploaded on: {new Date(document.uploadedAt).toLocaleString()}</p>
              </div>
              {document.documentUrl ? (
                <img 
                  src={document.documentUrl} 
                  alt="Uploaded Document" 
                  className="max-w-full max-h-60 object-contain mt-4" 
                />
              ) : (
                <p>No image available.</p>
              )}
              <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
                <Button icon={<UploadOutlined />} className="mt-4">Update File</Button>
              </Upload>
            </>
          ) : (
            <div>
              <p className="text-red-500">No document found. Please upload a document.</p>
              <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
                <Button icon={<UploadOutlined />} className="mt-4" type="primary">Upload Document</Button>
              </Upload>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Documents;
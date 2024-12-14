import React, { useState, useEffect } from 'react';
import { Button, Upload, Card, notification, Skeleton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import { fetchBusinessOwnerDocument, uploadBuisnessOwnerDocument } from "../../api/businessOwnerApi";
import { fetchManagerDocument, updateManagerOwnerDocument } from "../../api/managerApi";
import { fetchEmployeeDocument, updateEmployeeDocument } from "../../api/employeeApi";
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { motion } from 'framer-motion'; // Import motion for animations
import { toast } from 'react-toastify';
import { set } from 'zod';

const Documents = () => {
  const [document, setDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { businessOwner ,manager ,employee } = useAuth();

  // Fetch the document when the component mounts or when authentication status changes
  useEffect(() => {
    if (businessOwner.isAuthenticated) {
      setLoading(true);
      fetchBusinessOwnerDocument()
        .then((data) => {
          setDocument(data || null);
        })
        .catch((error) => {
          console.error('Error fetching business owner document:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if(manager.isAuthenticated){
      setLoading(true);
      fetchManagerDocument()
        .then((data) => {
          setDocument(data );
        })
        .catch((error) => {
          console.error('Error fetching business owner document:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }else if(employee.isAuthenticated){
      setLoading(true);
      fetchEmployeeDocument()
        .then((data) => {
          setDocument(data );
        })
        .catch((error) => {
          console.error('Error fetching business owner document:', error);
        })
        .finally(() => {
          setLoading(false);
        });


    }
  }, [businessOwner.isAuthenticated ,manager.isAuthenticated,employee.isAuthenticated]);

  console.log("=========================================");
  console.log("=========================================");
  console.log("document",document);
  
  console.log("=========================================");
  console.log("=========================================");
  
  
  const handleUpload = async (info: UploadChangeParam<UploadFile<any>>) => {
    const { file } = info;
    setLoading(true);
    const castedFile = file as unknown as File;
  
    // Only proceed if the user is authenticated
    if (businessOwner.isAuthenticated) {
          await uploadBuisnessOwnerDocument(castedFile);
          const updatedDocument = await fetchBusinessOwnerDocument();
          setDocument(updatedDocument || null);
          setLoading(false);
  }else if(manager.isAuthenticated){
          await updateManagerOwnerDocument(castedFile);
          const updatedDocument = await fetchManagerDocument();
          setDocument(updatedDocument || null);
          setLoading(false);
  }else if(employee.isAuthenticated){
          await updateEmployeeDocument(castedFile);
          const updatedDocument = await fetchEmployeeDocument();
          setDocument(updatedDocument || null);
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
          {/* Skeleton Placeholder when document is loading */}
          {loading ? (
            <Skeleton active />
          ) : document ? (
            <>
              <div className="flex flex-col">
                <p>Size: {document.documentSize}</p>
                <p>Uploaded on: {new Date(document.uploadedAt).toLocaleString()}</p>
              </div>
              {/* Check if document URL exists before displaying the image */}
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

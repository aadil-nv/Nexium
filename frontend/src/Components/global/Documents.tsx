import React, { useState, useEffect } from 'react';
import { List, Button, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { managerInstance } from '../../services/managerInstance';

export default function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const { themeColor } = useTheme();
  const { manager, employee } = useAuth();
  const isManager = manager.isAuthenticated;
  const isEmployee = employee.isAuthenticated;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let url = '';
        if (isManager) {
          url = '/manager/api/manager/get-managerdocuments';
        } else if (isEmployee) {
          url = '/employee/api/employeee/get-employeeDocumets';
        } else {
          message.error('Unauthorized access');
          return;
        }

        const response = await managerInstance.get(url);
        setDocuments(response.data);
      } catch (error) {
        message.error('Failed to fetch documents');
      }
    };

    fetchDocuments();
  }, [isManager, isEmployee]);

  const handleDelete = (documentId: string) => {
    setDocuments(documents.filter((doc) => doc._id !== documentId));
    message.success('Document deleted successfully!');
  };

  const showModal = (document: any) => {
    setCurrentDocument(document);
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  return (
    <div className="mt-6">
      <h2 className="mt-4">Uploaded Documents</h2>

      <List
        dataSource={documents}
        renderItem={(doc) => (
          <List.Item
            actions={[
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(doc._id)}
                danger
                style={{ backgroundColor: themeColor, borderColor: themeColor }}
                className="text-white"
              >
                Delete
              </Button>,
              <Button
                onClick={() => showModal(doc)}
                style={{ backgroundColor: themeColor, borderColor: themeColor }}
                className="text-white"
              >
                View Details
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <div>
                  {doc.documentUrl && <img src={doc.documentUrl} alt={doc.documentName} style={{ maxWidth: 50, marginRight: 10 }} />}
                  {doc.documentName}
                </div>
              }
              description={`Uploaded At: ${new Date(doc.uploadedAt).toLocaleString()}`}
            />
          </List.Item>
        )}
      />

      <Modal title="Document Details" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        {currentDocument && (
          <div>
            <h3>{currentDocument.documentName}</h3>
            <p>Uploaded At: {new Date(currentDocument.uploadedAt).toLocaleString()}</p>
            {currentDocument.documentUrl && (
              <div>
                <p>Document Preview:</p>
                <img src={currentDocument.documentUrl} alt={currentDocument.documentName} style={{ maxWidth: '100%' }} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

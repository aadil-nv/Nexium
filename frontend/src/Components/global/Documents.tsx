import React, { useState } from 'react';
import { Upload, Button, List, message, Modal } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';

export default function Documents() {
  const [fileList, setFileList] = useState<any[]>([
    { uid: '1', name: 'DemoFile1.pdf', status: 'done', size: 2048 },
    { uid: '2', name: 'DemoFile2.docx', status: 'done', size: 1024 },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFile, setCurrentFile] = useState<any>(null);
  const { themeColor } = useTheme();

  const handleChange = (info: any) => setFileList(info.fileList.map((file: any) => (file.response ? { ...file, url: file.response.url } : file)));

  const handleDelete = (file: any) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
    message.success('File deleted successfully!');
  };

  const showModal = (file: any) => {
    setCurrentFile(file);
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  return (
    <div className="mt-6">
      <Upload action="/upload" fileList={fileList} onChange={handleChange} multiple showUploadList={false}>
        <Button icon={<UploadOutlined />} style={{ backgroundColor: themeColor, borderColor: themeColor }} className='text-white'>
          Upload Documents
        </Button>
      </Upload>

      <h2 className="mt-4">Uploaded Documents</h2>

      <List
        dataSource={fileList}
        renderItem={(file) => (
          <List.Item
            actions={[
              <Button icon={<DeleteOutlined />} onClick={() => handleDelete(file)} danger style={{ backgroundColor: themeColor, borderColor: themeColor }} className='text-white'>Delete</Button>,
              <Button onClick={() => showModal(file)} style={{ backgroundColor: themeColor, borderColor: themeColor }} className='text-white'>View Details</Button>,
            ]}
          >
            <List.Item.Meta title={file.name} description={file.status === 'done' ? 'Uploaded' : 'Uploading...'} />
          </List.Item>
        )}
      />

      <Modal title="File Details" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        {currentFile && (
          <div>
            <h3>{currentFile.name}</h3>
            <p>Status: {currentFile.status}</p>
            <p>Size: {currentFile.size} bytes</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

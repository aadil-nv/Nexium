import React, { useState, useEffect } from 'react';
import { Card, Button, Upload, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ICardImageProps } from '../../interface/GlobalInterface';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';

const CardImage: React.FC<ICardImageProps> = ({ title, imgSrc, onImageChange }) => {
  const [image, setImage] = useState<string>(imgSrc || ''); // Stores the image URL
  console.log("imgSrc", imgSrc);
  
  const [loading, setLoading] = useState<boolean>(false); // Loading state for upload button

  // Effect to ensure the updated image is set and displayed immediately
  useEffect(() => {
    if (imgSrc) {
      setImage(imgSrc); // Update the image if the passed prop changes
    }
  }, [imgSrc]); // Run when the imgSrc prop changes

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); // Ensure the field name matches the Multer configuration
  
    try {
      setLoading(true);
      message.loading('Uploading image...', 0); // Show loading message

      const response = await businessOwnerInstance.post(
        '/businessOwner-service/api/business-owner/upload-images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Correct content type for file uploads
          },
        }
      );
  
      console.log('Image upload response:', response);
  
      const uploadedImageUrl = response.data.url; // Adjust based on the API response
      setImage(uploadedImageUrl); // Update the state with the new image URL
      onImageChange(uploadedImageUrl); // Pass the updated image URL to parent
      message.success('Image uploaded successfully!'); // Success message
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('Failed to upload image.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle file change (triggered after selecting the file)
  // const handleFileChange = ({ file }: any) => {
  //   if (file.status === 'done') {
  //     handleImageUpload(file.originFileObj); // Upload the selected image
  //   }
  // };

  return (
    <Card
      hoverable
      className="mb-2 flex flex-col items-center pt-4 h-[40%]"
      cover={
        <div className="relative">
          <img
            src={image} // The state image URL
            alt={title}
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
          <Upload
            accept="image/*"
            showUploadList={false} // Hide the default upload list
            beforeUpload={(file) => {
              handleImageUpload(file); // Handle the image upload manually
              return false; // Prevent automatic upload by Ant Design
            }}
          >
            <Button
              icon={<EditOutlined />}
              shape="circle"
              size="large"
              loading={loading} // Show loading spinner on button
              className="absolute bottom-0 right-0"
              style={{ borderColor: 'white', backgroundColor: 'white' }}
            />
          </Upload>
        </div>
      }
    >
      <h3 className="text-center">{title}</h3>
    </Card>
  );
};

export default CardImage;

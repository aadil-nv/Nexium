import React, { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message, Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { businessOwnerInstance } from "../../services/businessOwnerInstance";

const { TabPane } = Tabs;

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  managerId: string | null;
  managerDetails: any;
}

const tabConfigurations = [
  {
    key: "1",
    tab: "Personal Details",
    fields: [
      { label: "Full Name", name: "fullName", placeholder: "Enter your full name", type: "text" },
      { label: "Email", name: "email", placeholder: "Enter your email", type: "text" },
      { label: "Phone", name: "phone", placeholder: "Enter your phone", type: "text" },
      { label: "Personal website", name: "website", placeholder: "Enter your website", type: "text" },
      { label: "Profile Picture", name: "profilePicture", placeholder: "Upload your profile picture", type: "file", icon: <EditOutlined /> },
    ],
  },
  {
    key: "2",
    tab: "Professional Details",
    fields: [
      { label: "Position", name: "jobTitle", placeholder: "Enter your Position", type: "text" },
      { label: "Work Time", name: "workTime", placeholder: "Enter your workTime", type: "text" },
      { label: "Salary", name: "salary", placeholder: "Enter your salary", type: "text" },
      { label: "Joining Date", name: "dateOfJoin", placeholder: "Enter your joining date", type: "text" },
    ],
  },
];

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, managerId, managerDetails }) => {
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file: File) => {
      console.log("File is ====================:", file);
      const formData = new FormData();
    formData.append("profilePicture", file);

    console.log("Form Data:", formData);

    try {
      const response = await businessOwnerInstance.patch(
        `/businessOwner/api/manager/update-profile-pic/${managerId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.data?.success) {
        message.success("Profile picture updated successfully!");
        // Optionally, refresh the manager details here
      } else {
        message.error("Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to update profile picture.");
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await businessOwnerInstance.put(
        `/businessOwner/api/manager/update-personal-info/${managerId}`,
        values
      );
      message.success("Manager details updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update manager details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Information Modal" visible={visible} onCancel={onClose} footer={null} width={800}>
      <p>Manager ID: {managerId}</p>
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          {tabConfigurations.map((tab) => (
            <TabPane tab={tab.tab} key={tab.key}>
              <Form
                layout="vertical"
                initialValues={{
                  fullName: managerDetails?.personalDetails?.managerName,
                  email: managerDetails?.personalDetails?.email,
                  phone: managerDetails?.personalDetails?.phone,
                  website: managerDetails?.personalDetails?.personalWebsite,
                  jobTitle: managerDetails?.professionalDetails?.managerType,
                  workTime: managerDetails?.professionalDetails?.workTime,
                  salary: managerDetails?.professionalDetails?.salary,
                  dateOfJoin: managerDetails?.professionalDetails?.joiningDate
                    ? new Date(managerDetails?.professionalDetails?.joiningDate).toLocaleDateString()
                    : "",
                }}
                onFinish={handleSubmit}
              >
                {tab.fields.map((field) => (
                  <Form.Item key={field.name} label={field.label} name={field.name}>
                    {field.type === "text" && <Input placeholder={field.placeholder} />}
                    {field.type === "file" && (
                      <div>
                        {managerDetails?.personalDetails?.profilePicture && (
                          <div style={{ marginBottom: 10 }}>
                            <img
                              src={managerDetails?.personalDetails?.profilePicture}
                              alt="Profile"
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          id="file-input"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                        />
                        <Button
                          icon={field.icon}
                          onClick={() => document.getElementById("file-input")?.click()}
                        >
                          Upload Image
                        </Button>
                      </div>
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Update Details
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          ))}
        </Tabs>
      </Spin>
    </Modal>
  );
};

export default InfoModal;

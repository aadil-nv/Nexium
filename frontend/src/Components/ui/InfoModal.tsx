import React, { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message, Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { businessOwnerInstance } from "../../services/businessOwnerInstance";

const { TabPane } = Tabs;

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  managerId: string | null;
  managerDetails: any; // Accept manager details as a prop
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
  {
    key: "3",
    tab: "Address",
    fields: [
      { label: "Street", name: "street", placeholder: "Enter your street address", type: "text" },
      { label: "City", name: "city", placeholder: "Enter your city", type: "text" },
      { label: "Postal Code", name: "postalCode", placeholder: "Enter your postal code", type: "text" },
      { label: "Country", name: "country", placeholder: "Enter your country", type: "text" },
      { label: "State", name: "state", placeholder: "Enter your state", type: "text" },
    ],
  },
  {
    key: "4",
    tab: "Documents",
    fields: [
      { label: "Upload ID", name: "uploadId", placeholder: "", type: "file" },
      { label: "Upload Proof of Address", name: "uploadAddressProof", placeholder: "", type: "file" },
    ],
  },
  {
    key: "5",
    tab: "Security",
    fields: [
      { label: "Company Email", name: "companyEmail", placeholder: "Enter old password", type: "text" },
      { label: "Company Password", name: "companyPassword", placeholder: "Enter new password", type: "password" },
    ],
  }
  // Other tabs here...
];

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, managerId, managerDetails }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      let response;

      if (values.street || values.city || values.postalCode || values.country || values.state) {
        response = await businessOwnerInstance.put(
          `/businessOwner/api/manager/update-address-info/${managerId}`,
          values
        );
        message.success("Address details updated successfully!");
      } else {
        if (values.jobTitle || values.workTime || values.salary || values.dateOfJoin) {
          response = await businessOwnerInstance.put(
            `/businessOwner/api/manager/update-professional-info/${managerId}`,
            values
          );
        } else {
          response = await businessOwnerInstance.put(
            `/businessOwner/api/manager/update-personal-info/${managerId}`,
            values
          );
        }
        message.success("Manager details updated successfully!");
      }

      onClose();
    } catch (error) {
      message.error("Failed to update manager details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Information Modal"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
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
                  street: managerDetails?.address?.street,
                  city: managerDetails?.address?.city,
                  postalCode: managerDetails?.address?.zip,
                  country: managerDetails?.address?.country,
                  state: managerDetails?.address?.state,
                  companyEmail: managerDetails?.managerCredentials?.companyEmail,
                  companyPassword: managerDetails?.managerCredentials?.companyPassword,
                }}
                onFinish={handleSubmit}
              >
                {tab.fields.map((field) => (
                  <Form.Item key={field.name} label={field.label} name={field.name}>
                    {field.type === "text" && <Input placeholder={field.placeholder} />}
                    {field.type === "file" && <Input type="file" />}
                    {field.type === "password" && <Input.Password placeholder={field.placeholder} />}
                    {field.name === "profilePicture" && (
                      <div>
                        {/* Display profile picture in a circle if exists */}
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
                        <Button icon={field.icon} style={{ marginTop: 10 }} />
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
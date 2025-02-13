import React, { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { businessOwnerInstance } from "../../services/businessOwnerInstance";
import { InfoModalProps } from "../../interface/managerInterface";

const { TabPane } = Tabs;

const tabConfigurations = [
  {
    key: "1",
    tab: "Personal Details",
    fields: [
      { label: "Full Name", name: "fullName", placeholder: "Enter your full name", type: "text" },
      { label: "Email", name: "email", placeholder: "Enter your email", type: "text" },
      { label: "Phone", name: "phone", placeholder: "Enter your phone", type: "text" },
      { label: "Personal website", name: "website", placeholder: "Enter your website", type: "text" },
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
    key: "5",
    tab: "Security",
    fields: [
      { label: "Company Email", name: "companyEmail", placeholder: "Enter company email", type: "text" },
      { label: "Company Password", name: "companyPassword", placeholder: "Enter company password", type: "password" },
    ],
  },
];

const InfoModal: React.FC<InfoModalProps> = ({ 
  visible, 
  onClose, 
  managerId, 
  managerDetails,
  onUpdate 
}) => {
  console.log("manager detailes is ->",managerDetails);
  
  const [loading, setLoading] = useState(false);
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);

  const handleUpdateProfilePicture = async (file: File) => {
    setProfilePictureLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await businessOwnerInstance.patch(
        `/businessOwner-service/api/manager/update-profile-pic/${managerId}`,
        formData
      );
      
      message.success("Profile picture updated successfully!");
      if (onUpdate) {
        onUpdate(managerId);
      }
    } catch (error) {
      console.log("Error updating profile picture:", error);
      message.error("Failed to update profile picture.");
    } finally {
      setProfilePictureLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (values.street || values.city || values.postalCode || values.country || values.state) {
        await businessOwnerInstance.put(
          `/businessOwner-service/api/manager/update-address-info/${managerId}`,
          values
        );
        message.success("Address details updated successfully!");
      } else {
        if (values.jobTitle || values.workTime || values.salary || values.dateOfJoin) {
          await businessOwnerInstance.put(
            `/businessOwner-service/api/manager/update-professional-info/${managerId}`,
            values
          );
        } else {
          await businessOwnerInstance.put(
            `/businessOwner-service/api/manager/update-personal-info/${managerId}`,
            values
          );
        }
        message.success("Manager details updated successfully!");
      }
      if (onUpdate) {
        onUpdate(managerId);
      }
      onClose();
    } catch (error) {
      console.log("Error updating manager details:", error);      
      message.error("Failed to update manager details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Information Modal"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="max-h-[90vh] overflow-auto"
    >
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <img
            src={managerDetails?.personalDetails?.profilePicture || "/api/placeholder/100/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpdateProfilePicture(file);
              return false;
            }}
          >
            <Button
              icon={<UploadOutlined />}
              loading={profilePictureLoading}
              className="absolute bottom-0 right-0"
              size="small"
            >
              Update
            </Button>
          </Upload>
        </div>
        <p className="mt-2">Manager ID: {managerId}</p>
      </div>
      
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
                  postalCode: managerDetails?.address?.postalCode,
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
                    {field.type === "password" && (
                      <Input.Password placeholder={field.placeholder} />
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
import React, { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message, Spin, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { IEmployeeData } from "../../interface/managerInterface";
import { managerInstance } from "../../services/managerInstance";

const { TabPane } = Tabs;

interface InfoModalProps {
  employeeData: IEmployeeData;
  visible: boolean;
  onClose: () => void;
}

const tabConfigurations = [
  { key: "1", tab: "Personal Details", fields: ["profilePicture", "employeeName", "email", "phone"] },
  { key: "2", tab: "Professional Details", fields: ["jobTitle", "workTime", "salary", "dateOfJoin", "department", "currentStatus", "companyName"] },
  { key: "3", tab: "Address", fields: ["street", "city", "postalCode", "country", "state"] },
  { key: "4", tab: "Documents", fields: ["uploadId", "uploadResume"] },
  { key: "5", tab: "Security", fields: ["companyEmail", "companyPassword"] },
];

const EmployeeInfoModal: React.FC<InfoModalProps> = ({ visible, onClose, employeeData }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (tabKey: string, values: any) => {
    setLoading(true);
    try {
      let endpoint = "";

      if (tabKey === "1") {
        endpoint = `/manager/api/employee/update-personalinformation/${employeeData._id}`;
      } else if (tabKey === "2") {
        endpoint = `/manager/api/employee/update-professionalinformation/${employeeData._id}`;
      } else if (tabKey === "3") {
        endpoint = `/manager/api/employee/update-address/${employeeData._id}`;
      } else if (tabKey === "4") {
        endpoint = `/manager/api/employee/update-documents/${employeeData._id}`;
      } else if (tabKey === "5") {
        endpoint = `/manager/api/employee/update-security/${employeeData._id}`;
      }

      await managerInstance
      .post(endpoint, values);
      message.success("Details updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = (field: string) => {
    console.log(`Upload ${field}`);
  };

  return (
    <Modal
      title="Employee Information"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          {tabConfigurations.map((tab) => (
            <TabPane tab={tab.tab} key={tab.key}>
              <Form
                layout="vertical"
                initialValues={{
                  employeeName: employeeData?.personalDetails?.employeeName,
                  email: employeeData?.personalDetails?.email,
                  phone: employeeData?.personalDetails?.phone,
                  jobTitle: employeeData?.professionalDetails?.position,
                  workTime: employeeData?.professionalDetails?.workTime,
                  department: employeeData?.professionalDetails?.department,
                  currentStatus: employeeData?.professionalDetails?.workTime,
                  companyName: employeeData?.professionalDetails?.companyName,
                  skills: employeeData?.professionalDetails?.skills,
                  salary: employeeData?.professionalDetails?.salary,
                  dateOfJoin: employeeData?.professionalDetails?.joiningDate ? 
                    new Date(employeeData?.professionalDetails?.joiningDate).toLocaleDateString() : "",
                  street: employeeData?.address?.street,
                  city: employeeData?.address?.city,
                  postalCode: employeeData?.address?.postalCode,
                  country: employeeData?.address?.country,
                  state: employeeData?.address?.state,
                  companyEmail: employeeData?.employeeCredentials?.companyEmail,
                  companyPassword: employeeData?.employeeCredentials?.companyPassword,
                }}
                onFinish={(values) => handleSubmit(tab.key, values)}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {tab.fields.map((field) => (
                    <div key={field} style={{ flex: "1 0 48%" }}>
                      <Form.Item label={field} name={field}>
                        {field.includes("upload") ? (
                          <Button
                            icon={<UploadOutlined />}
                            onClick={() => handleDocumentUpload(field)}
                          >
                            Upload {field === "uploadId" ? "ID Proof" : "Resume"}
                          </Button>
                        ) : (
                          <Input
                            placeholder={`Enter your ${field}`}
                            type={field.includes("Password") ? "password" : "text"}
                          />
                        )}
                      </Form.Item>
                    </div>
                  ))}
                </div>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Save Changes
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

export default EmployeeInfoModal;

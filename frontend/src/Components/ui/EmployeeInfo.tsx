import React, { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, Button, message, Spin, Upload, Select } from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { managerInstance } from "../../services/managerInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

const { TabPane } = Tabs;
const { Option } = Select;

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  employeeId: string | null;
}

const tabConfigurations = [
  { key: "1", tab: "Personal Details", fields: ["profilePicture", "employeeName", "email", "phone", "aadharNumber", "panNumber", "gender", "bankAccountNumber", "ifscCode"] },
  { key: "2", tab: "Professional Details", fields: ["position", "workTime", "salary", "joiningDate", "department", "currentStatus", "companyName", "pfAccount", "esiAccount", "uanNumber"] },
  { key: "3", tab: "Address", fields: ["street", "city", "postalCode", "country", "state"] },
  { key: "4", tab: "Documents", fields: ["uploadResume"] },
  { key: "5", tab: "Security", fields: ["companyEmail", "companyPassword"] },
];

const EmployeeInfoModal: React.FC<InfoModalProps> = ({ visible, onClose, onUpdate, employeeId }) => {
  const [loading, setLoading] = useState(false);
  const employeeData = useSelector((state: RootState) => state.manager.employeeData?.employeeData);
  const [profilePicture, setProfilePicture] = useState(employeeData?.personalDetails?.profilePicture);
  const [resumeData, setResumeData] = useState(employeeData?.documents?.resume);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...employeeData?.personalDetails,
      ...employeeData?.professionalDetails,
      ...employeeData?.address,
      ...employeeData?.employeeCredentials,
    });
    setProfilePicture(employeeData?.personalDetails?.profilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png");
    setResumeData(employeeData?.documents?.resume || "");
  }, [employeeData, form]);

  const handleSubmit = async (tabKey: string, values:unknown) => {
    if (!employeeId) return;
    
    setLoading(true);
    try {
      const endpoints: Record<string, string> = {
        "1": `/manager-service/api/employee/update-personalinformation/${employeeId}`,
        "2": `/manager-service/api/employee/update-professionalinformation/${employeeId}`,
        "3": `/manager-service/api/employee/update-address/${employeeId}`,
        "4": `/manager-service/api/employee/update-documents/${employeeId}`,
        "5": `/manager-service/api/employee/update-credentials/${employeeId}`,
      };

      await managerInstance.post(endpoints[tabKey], values);
      message.success("Details updated successfully!");
      onUpdate(); // Call the onUpdate prop to refresh the table
    } catch (error) {
      message.error((error as Error).message ||"Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, tabKey: string) => {
    if (!employeeId) return;
    
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await managerInstance.post(`/manager-service/api/employee/update-${tabKey}/${employeeId}`, formData);
      if (tabKey === "profile-picture") {
        setProfilePicture(response.data.data.imageUrl);
      } else if (tabKey === "resume") {
        setResumeData({
          name: response.data.data.fileName,
          size: response.data.data.fileSize,
          uploadedTime: response.data.data.uploadedTime,
        });
      }
      message.success("File uploaded successfully!");
      onUpdate(); // Refresh the table after file upload
    } catch {
      message.error("Failed to upload file.");
    } finally {
      setLoading(false);
    }
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
                form={form}
                layout="vertical"
                onFinish={(values) => handleSubmit(tab.key, values)}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {tab.fields.map((field) => (
                    <div key={field} style={{ flex: "1 0 48%" }}>
                      {field === "profilePicture" ? (
                        <div>
                          <img
                            src={profilePicture}
                            alt="Profile"
                            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                          />
                          <Upload
                            beforeUpload={(file) => {
                              handleFileUpload(file, "profile-picture");
                              return false;
                            }}
                            showUploadList={false}
                          >
                            <Button icon={<EditOutlined />}>Change Picture</Button>
                          </Upload>
                        </div>
                      ) : field === "uploadResume" ? (
                        <div>
                          {resumeData ? (
                            <div style={{ marginBottom: "10px" }}>
                              <img src={resumeData.documentUrl} alt="" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
                              <p><strong>Document Name:</strong> {resumeData.documentName}</p>
                              <p><strong>Size:</strong> {(resumeData.documentSize / 1024).toFixed(2)} KB</p>
                              <p><strong>Uploaded Time:</strong> {new Date(resumeData.uploadedAt).toLocaleString()}</p>
                            </div>
                          ) : (
                            <p>No document uploaded</p>
                          )}
                          <Upload
                            beforeUpload={(file) => {
                              handleFileUpload(file, "resume");
                              return false;
                            }}
                            showUploadList={false}
                          >
                            <Button icon={<UploadOutlined />}>Upload Resume</Button>
                          </Upload>
                        </div>
                      ) : field === "gender" ? (
                        <Form.Item label="Gender" name="gender">
                          <Select placeholder="Select Gender">
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                            <Option value="Other">Other</Option>
                          </Select>
                        </Form.Item>
                      ) : field === "department" ? (
                        <Form.Item label="Department" name="department">
                          {employeeData?.professionalDetails?.department === null || 
                           employeeData?.professionalDetails?.department === undefined ? (
                            <Input value="Not added into department" disabled />
                          ) : (
                            <Input value={employeeData?.professionalDetails?.department || "No department"} disabled />
                          )}
                        </Form.Item>
                      ) : field === "position" ? (
                        <Form.Item label="Position" name="position">
                          <Select defaultValue={employeeData?.professionalDetails?.position || "Team Lead"}>
                            <Option value="Team Lead">Team Lead</Option>
                            <Option value="Senior Software Engineer">Senior Software Engineer</Option>
                            <Option value="Junior Software Engineer">Junior Software Engineer</Option>
                          </Select>
                        </Form.Item>
                      ) : field === "workTime" ? (
                        <Form.Item label="Work Time" name="workTime">
                          <Select defaultValue={employeeData?.professionalDetails?.workTime || ""}>
                            <Option value="Full-Time">Full-Time</Option>
                            <Option value="Part-Time">Part-Time</Option>
                            <Option value="Contract">Contract</Option>
                            <Option value="Temporary">Temporary</Option>
                          </Select>
                        </Form.Item>
                      ) : (
                        <Form.Item label={field} name={field}>
                          <Input />
                        </Form.Item>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="primary" htmlType="submit" block>
                  Submit
                </Button>
              </Form>
            </TabPane>
          ))}
        </Tabs>
      </Spin>
    </Modal>
  );
};

export default EmployeeInfoModal;
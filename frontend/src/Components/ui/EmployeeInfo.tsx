import React, { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, Button, message, Spin, Upload } from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { managerInstance } from "../../services/managerInstance";
import { IEmployeeData } from "../../interface/managerInterface";
import { RootState } from "../../redux/store/store";
import { useSelector, useDispatch } from "react-redux";
import { clearEmployeeData } from "../../redux/slices/managerSlice"; // Import the action

const { TabPane } = Tabs;

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const tabConfigurations = [
  { key: "1", tab: "Personal Details", fields: ["profilePicture", "employeeName", "email", "phone"] },
  { key: "2", tab: "Professional Details", fields: ["position", "workTime", "salary", "dateOfJoin", "department", "currentStatus", "companyName"] },
  { key: "3", tab: "Address", fields: ["street", "city", "postalCode", "country", "state"] },
  { key: "4", tab: "Documents", fields: ["uploadId", "uploadResume"] },
  { key: "5", tab: "Security", fields: ["companyEmail", "companyPassword"] },
];

const EmployeeInfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const employeeData = useSelector((state: RootState) => state.manager.employeeData?.employeeData);
  const dispatch = useDispatch(); // To dispatch actions
  
  // States for modal data
  const [profilePicture, setProfilePicture] = useState(employeeData?.personalDetails?.profilePicture);
  const [resumeData, setResumeData] = useState(employeeData?.documents?.resume);
  const [personalData, setPersonalData] = useState(employeeData?.personalDetails);

  // Initialize form using Form.useForm()
  const [form] = Form.useForm(); 

  // Update states when employeeData changes
  useEffect(() => {
    setPersonalData(employeeData?.personalDetails || null);
    setProfilePicture(employeeData?.personalDetails?.profilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png");
    setResumeData(employeeData?.documents?.resume || null);

    // Set form initial values when employee data is updated
    form.setFieldsValue({
      employeeName: employeeData?.personalDetails?.employeeName,
      email: employeeData?.personalDetails?.email,
      phone: employeeData?.personalDetails?.phone,
      position: employeeData?.professionalDetails?.position,
      workTime: employeeData?.professionalDetails?.workTime || "",
      department: employeeData?.professionalDetails?.department || "Not added",
      currentStatus: employeeData?.professionalDetails?.currentStatus || "Not added",
      companyName: employeeData?.professionalDetails?.companyName,
      salary: employeeData?.professionalDetails?.salary,
      dateOfJoin: employeeData?.professionalDetails?.joiningDate
        ? new Date(employeeData?.professionalDetails?.joiningDate).toLocaleDateString()
        : "",
      street: employeeData?.address?.street,
      city: employeeData?.address?.city,
      postalCode: employeeData?.address?.postalCode,
      country: employeeData?.address?.country,
      state: employeeData?.address?.state,
      companyEmail: employeeData?.employeeCredentials?.companyEmail,
      companyPassword: employeeData?.employeeCredentials?.companyPassword,
    });
  }, [employeeData, form]);
  console.log("profilePicture",profilePicture);
  

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

      await managerInstance.post(endpoint, values);
      message.success("Details updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    managerInstance
      .post(`/manager/api/employee/update-profile-picture/${employeeData._id}`, formData)
      .then((response) => {
        setProfilePicture(response.data.data.imageUrl);
        message.success("Profile picture updated!");
      })
      .catch(() => {
        message.error("Failed to update profile picture.");
      });
  };

  const handleDocumentUpload = async (field: string, file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await managerInstance.post(
        `/manager/api/employee/update-resume/${employeeData._id}`,
        formData
      );
      setResumeData(response.data.data.resume);
      message.success("Resume uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload resume.");
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
                form={form}  // Bind the form instance here
                layout="vertical"
                onFinish={(values) => handleSubmit(tab.key, values)}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {tab.fields.map((field) => (
                    <div key={field} style={{ flex: "1 0 48%" }}>
                      {field === "profilePicture" ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              backgroundColor: "#f0f0f0",
                              position: "relative",
                            }}
                          >
                                                       

                            <img
                              src={profilePicture}
                              alt="Profile"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <Upload
                              showUploadList={false}
                              beforeUpload={handleProfilePictureChange}
                            >
                           
                              
                              <Button
                                icon={<EditOutlined />}
                                style={{
                                  position: "absolute",
                                  bottom: "5px",
                                  right: "5px",
                                  borderRadius: "50%",
                                  backgroundColor: "#fff",
                                  padding: "5px",
                                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                }}
                              />
                            </Upload>
                          </div>
                        </div>
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

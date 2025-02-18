import { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, Button, message, Spin, Select, Upload } from "antd";
import { EditOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { businessOwnerInstance } from "../../../services/businessOwnerInstance";
import type { Employee } from './EmployeeTypes';

const { TabPane } = Tabs;
const { Option } = Select;

interface EmployeeInfoModalProps {
    isVisible: boolean;
    onClose: () => void;
    employee: Employee | null;
    onUpdate: (updatedEmployee: Employee) => void;
}

const tabConfigurations = [
    {
      key: "1",
      tab: "Personal Details",
      fields: [
        { label: "Employee Name", name: "employeeName", placeholder: "Enter your full name", type: "text" },
        { label: "Email", name: "email", placeholder: "Enter your email", type: "text" },
        { label: "Phone", name: "phone", placeholder: "Enter your phone", type: "text" },
        { label: "Personal website", name: "website", placeholder: "Enter your website", type: "text" },
        { label: "Profile Picture", name: "profilePicture", placeholder: "Upload your profile picture", type: "file", icon: <EditOutlined /> },
        { label: "Bank Account Number", name: "bankAccountNumber", placeholder: "Enter bank account number", type: "text" },
        { label: "IFSC Code", name: "ifscCode", placeholder: "Enter IFSC code", type: "text" },
        { label: "Aadhar Number", name: "aadharNumber", placeholder: "Enter Aadhar number", type: "text" },
        { label: "PAN Number", name: "panNumber", placeholder: "Enter PAN number", type: "text" },
        { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
      ],
    },
    {
      key: "2",
      tab: "Professional Details",
      fields: [
        { 
          label: "Position", 
          name: "position", 
          type: "select",
          options: ["Team Lead", "Senior Software Engineer", "Junior Software Engineer"]
        },
        { 
          label: "Work Time", 
          name: "workTime", 
          type: "select",
          options: ["Full-Time", "Part-Time", "Contract", "Temporary"]
        },
        { label: "Salary", name: "salary", placeholder: "Enter your salary", type: "number" },
        { label: "Joining Date", name: "joiningDate", placeholder: "Enter your joining date", type: "text" },
        { label: "Department", name: "department", placeholder: "Enter department", type: "text" },
        { label: "Current Status", name: "currentStatus", placeholder: "Enter current status", type: "text" },
        { label: "UAN Number", name: "uanNumber", placeholder: "Enter UAN number", type: "text" },
        { label: "PF Account", name: "pfAccount", placeholder: "Enter PF account", type: "text" },
        { label: "ESI Account", name: "esiAccount", placeholder: "Enter ESI account", type: "text" },
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
      tab: "Security",
      fields: [
        { label: "Company Email", name: "companyEmail", placeholder: "Enter company email", type: "text" },
        { label: "Company Password", name: "companyPassword", placeholder: "Enter company password", type: "password" },
      ],
    },
    {
      key: "5",
      tab: "Leaves",
      fields: [
        { label: "Sick Leave", name: "sickLeave", placeholder: "Enter sick leave count", type: "number" },
        { label: "Casual Leave", name: "casualLeave", placeholder: "Enter casual leave count", type: "number" },
        { label: "Maternity Leave", name: "maternityLeave", placeholder: "Enter maternity leave count", type: "number" },
        { label: "Paternity Leave", name: "paternityLeave", placeholder: "Enter paternity leave count", type: "number" },
        { label: "Paid Leave", name: "paidLeave", placeholder: "Enter paid leave count", type: "number" },
        { label: "Unpaid Leave", name: "unpaidLeave", placeholder: "Enter unpaid leave count", type: "number" },
        { label: "Compensatory Leave", name: "compensatoryLeave", placeholder: "Enter compensatory leave count", type: "number" },
        { label: "Bereavement Leave", name: "bereavementLeave", placeholder: "Enter bereavement leave count", type: "number" },
        { label: "Marriage Leave", name: "marriageLeave", placeholder: "Enter marriage leave count", type: "number" },
        { label: "Study Leave", name: "studyLeave", placeholder: "Enter study leave count", type: "number" },
      ],
    },
  ];

const EmployeeInfoModal: React.FC<EmployeeInfoModalProps> = ({ 
    isVisible, 
    onClose, 
    employee,
    onUpdate 
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [form] = Form.useForm();
  const [profilePicture, setProfilePicture] = useState<string>('');

  // Update form values when employee data changes
  useEffect(() => {
    if (employee) {
      setProfilePicture(employee.personalDetails?.profilePicture || '');
      form.setFieldsValue({
        // Personal Details
        employeeName: employee.personalDetails?.employeeName,
        email: employee.personalDetails?.email,
        phone: employee.personalDetails?.phone,
        website: employee.personalDetails?.personalWebsite,
        bankAccountNumber: employee.personalDetails?.bankAccountNumber,
        ifscCode: employee.personalDetails?.ifscCode,
        aadharNumber: employee.personalDetails?.aadharNumber,
        panNumber: employee.personalDetails?.panNumber,
        gender: employee.personalDetails?.gender,

        // Professional Details
        position: employee.professionalDetails?.position,
        workTime: employee.professionalDetails?.workTime,
        salary: employee.professionalDetails?.salary,
        joiningDate: employee.professionalDetails?.joiningDate
          ? new Date(employee.professionalDetails?.joiningDate).toLocaleDateString()
          : "",
        department: employee.professionalDetails?.department,
        currentStatus: employee.professionalDetails?.currentStatus,
        uanNumber: employee.professionalDetails?.uanNumber,
        pfAccount: employee.professionalDetails?.pfAccount,
        esiAccount: employee.professionalDetails?.esiAccount,

        // Address
        street: employee.address?.street,
        city: employee.address?.city,
        postalCode: employee.address?.postalCode,
        country: employee.address?.country,
        state: employee.address?.state,

        // Security
        companyEmail: employee.employeeCredentials?.companyEmail,
        companyPassword: employee.employeeCredentials?.companyPassword,

         // Leave
         sickLeave: employee.employeeLeaves?.sickLeave,
         casualLeave: employee.employeeLeaves?.casualLeave,
         maternityLeave: employee.employeeLeaves?.maternityLeave,
         paternityLeave: employee.employeeLeaves?.paternityLeave,
         paidLeave: employee.employeeLeaves?.paidLeave,
         unpaidLeave: employee.employeeLeaves?.unpaidLeave,
         compensatoryLeave: employee.employeeLeaves?.compensatoryLeave,
         bereavementLeave: employee.employeeLeaves?.bereavementLeave,
         marriageLeave: employee.employeeLeaves?.marriageLeave,
         studyLeave: employee.employeeLeaves?.studyLeave,
      });
    }
  }, [employee, form]);

  const validateLeaveField = (_: unknown, value: number | string): Promise<void> => {
    if (value === undefined || value === null || value === '') {
      return Promise.reject(new Error('Leave count is required'));
    }
    
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return Promise.reject(new Error('Please enter a valid number'));
    }
    
    if (numValue < 0) {
      return Promise.reject(new Error('Leave count cannot be negative'));
    }
    
    if (numValue > 100) {
      return Promise.reject(new Error('Leave count cannot exceed 100 days'));
    }
    
    return Promise.resolve();
  };

  const handleProfilePictureUpdate = async (file: File) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await businessOwnerInstance.post(
        `/businessOwner-service/api/employee/update-profile-picture/${employee?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.status === 200) {
        setProfilePicture(response.data);
        onUpdate({...employee!, personalDetails: {...employee!.personalDetails, profilePicture: response.data}});
        message.success("Profile picture updated successfully!");
      } else {
        message.error("Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      message.error("Failed to update profile picture.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (values: Record<string, string | number>) => {
    console.log("values",values);
    
    if (!employee?._id) return;
    const currentTab = form.getFieldValue('currentTab');
    
    try {
      setLoading(true);
      
      // For leave tab, validate all leave fields before proceeding
      if (currentTab === '5') {
        const leaveFields = ['sickLeave', 'casualLeave', 'maternityLeave', 'paternityLeave',
          'paidLeave', 'unpaidLeave', 'compensatoryLeave', 'bereavementLeave',
          'marriageLeave', 'studyLeave'];
        
        // Extra validation to catch any potential issues
        const leaveErrors: string[] = [];
        leaveFields.forEach(field => {
          const value = values[field];
          console.log("value",value);
          
          console.log("field",field);
          
          if (value === undefined || value === null || value === '') {
            leaveErrors.push(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
          } else {
            const numValue = Number(value);
            if (isNaN(numValue)) {
              leaveErrors.push(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} must be a valid number`);
            } else if (numValue < 0) {
              leaveErrors.push(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} cannot be negative`);
            } else if (numValue > 100) {
              leaveErrors.push(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} cannot exceed 100 days`);
            }
          }
        });
        
        if (leaveErrors.length > 0) {
          leaveErrors.forEach(err => message.error(err));
          setLoading(false);
          return;
        }
      }
      
      let response;
      
      switch (currentTab) {
        case '1': // Personal Details
           response = await businessOwnerInstance.put(
            `/businessOwner-service/api/employee/update-personal-info/${employee._id}`,
            values
          );
          message.success("Personal details updated successfully!");
          break;

        case '2': // Professional Details
        response =  await businessOwnerInstance.put(
            `/businessOwner-service/api/employee/update-professional-info/${employee._id}`,
            values
          );
          message.success("Professional details updated successfully!");
          break;

        case '3': // Address
        response = await businessOwnerInstance.put(
            `/businessOwner-service/api/employee/update-address-info/${employee._id}`,
            values
          );
          message.success("Address details updated successfully!");
          break;

        case '4': // Security
        response = await businessOwnerInstance.put(
            `/businessOwner-service/api/employee/update-security-info/${employee._id}`,
            values
          );
          message.success("Security details updated successfully!");
          break;

        case '5': // Leave Details
        response = await businessOwnerInstance.put(
            `/businessOwner-service/api/employee/update-leave-info/${employee._id}`,
            values
          );
          message.success("Leave details updated successfully!");
          break;
      }

      if (response?.data) {
        onUpdate(response.data);  // Pass the updated employee data to parent
      }

      onClose();
    } catch (error) {
      console.error("Error updating employee details:", error);      
      message.error("Failed to update employee details. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderProfilePicture = () => (
    <div className="flex flex-col items-center mb-4 pt-2">
      <div className="relative">
        {profilePicture ? (
          <img
            src={profilePicture ? profilePicture : 'https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png'}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <UserOutlined className="text-2xl text-gray-400" />
          </div>
        )}
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleProfilePictureUpdate(file);
            return false;
          }}
        >
          <Button 
            icon={uploadingPhoto ? <LoadingOutlined /> : <EditOutlined />}
            className="absolute bottom-0 right-0"
            shape="circle"
            size="small"
          />
        </Upload>
      </div>
      <div className="mt-2 text-center">
        <h3 className="text-base font-medium">{employee?.personalDetails?.employeeName}</h3>
        <p className="text-sm text-gray-500">{employee?.professionalDetails?.position}</p>
      </div>
    </div>
  );

  return (
    <Modal
      title="Employee Information"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={600}
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      {renderProfilePicture()}
      <div className="text-sm mb-4">Employee ID: {employee?._id}</div>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={(_, values) => {
            form.setFieldValue('currentTab', values.currentTab);
          }}
        >
          <Form.Item name="currentTab" hidden initialValue="1" />
          <Tabs 
            defaultActiveKey="1"
            onChange={(key) => form.setFieldValue('currentTab', key)}
            className="overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          >
            {tabConfigurations.map((tab) => (
              <TabPane tab={tab.tab} key={tab.key} className="scrollbar-thin scrollbar-thumb-gray-400">
                {tab.fields.map((field) => (
                  <Form.Item 
                    key={field.name} 
                    label={field.label} 
                    name={field.name}
                    className="lg-3"
                    rules={[
                      // Apply special validation rules for leave fields
                      tab.key === "5" ? {
                        validator: validateLeaveField
                      } : (
                        field.type === "number" ? {
                          type: 'number',
                          required: true,
                          message: `Please enter a valid ${field.label.toLowerCase()}`
                        } : {
                          required: tab.key === "1" && ['employeeName', 'email'].includes(field.name),
                          message: `Please enter ${field.label.toLowerCase()}`
                        }
                      )
                    ]}
                  >
                    {field.type === "text" && (
                      <Input placeholder={field.placeholder} className="max-w-lg" />
                    )}
                    {field.type === "number" && (
                      <Input type="number" placeholder={field.placeholder} className="max-w-lg" />
                    )}
                    {field.type === "password" && (
                      <Input.Password placeholder={field.placeholder} className="max-w-lg" />
                    )}
                    {field.type === "select" && (
                      <Select 
                        placeholder={`Select ${field.label.toLowerCase()}`}
                        className="max-w-lg"
                      >
                        {field.options?.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Update {tab.tab}
                  </Button>
                </Form.Item>
              </TabPane>
            ))}
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EmployeeInfoModal;
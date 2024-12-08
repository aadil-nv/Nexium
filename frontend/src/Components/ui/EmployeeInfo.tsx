import React, { useState, useEffect } from "react";
import { Modal, Tabs, Input, DatePicker, Button, Upload } from "antd";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";

const { TabPane } = Tabs;

interface IEmployee {
  personalDetails: {
    employeeName: string;
    email: string;
    phone: string;
    profilePicture: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  professionalDetails: {
    position: "Team Lead" | "Senior Software Engineer" | "Junior Software Engineer";
    department: string;
    workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
    joiningDate: Date;
    currentStatus: string;
    companyName: string;
    salary: number;
    skills: string[];
  };
  employeeCredentials: {
    companyEmail: string;
    companyPassword: string;
  };
  documents: {
    resume: string;
    idProof: string;
  };
}

const EmployeeModal = ({ isVisible, employeeId, onCancel }: { isVisible: boolean, employeeId: string, onCancel: () => void }) => {
  const [formData, setFormData] = useState<IEmployee | null>(null);

  console.log("================================")
  console.log("")
  console.log("employeeId: ", employeeId)
  console.log("")
  console.log("================================")

  // Simulate fetching employee data
  useEffect(() => {
    if (employeeId && isVisible) {

      const fetchEmployeeData = async () => {

        const data: IEmployee = {
          personalDetails: {
            employeeName: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            profilePicture: "",
          },
          address: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            country: "USA",
            postalCode: "10001",
          },
          professionalDetails: {
            position: "Senior Software Engineer",
            department: "Engineering",
            workTime: "Full-Time",
            joiningDate: new Date("2020-01-01"),
            currentStatus: "Active",
            companyName: "Tech Corp",
            salary: 80000,
            skills: ["JavaScript", "React", "Node.js"],
          },
          employeeCredentials: {
            companyEmail: "john@techcorp.com",
            companyPassword: "password123",
          },
          documents: {
            resume: "resume_url",
            idProof: "id_proof_url",
          },
        };

        setFormData(data);
      };

      fetchEmployeeData();
    }
  }, [employeeId, isVisible]);

  const handleEditChange = (field: string, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  if (!formData) {
    return null; // Optionally, you can display a loading state until the data is fetched
  }

  return (
    <Modal
      title="Edit Employee"
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <Tabs defaultActiveKey="1">
        {/* Personal Details Tab */}
        <TabPane tab="Personal Details" key="1">
          <div className="space-y-4">
            <Input
              value={formData.personalDetails.employeeName}
              onChange={(e) => handleEditChange("personalDetails.employeeName", e.target.value)}
              placeholder="Employee Name"
            />
            <Input
              value={formData.personalDetails.email}
              onChange={(e) => handleEditChange("personalDetails.email", e.target.value)}
              placeholder="Email"
            />
            <Input
              value={formData.personalDetails.phone}
              onChange={(e) => handleEditChange("personalDetails.phone", e.target.value)}
              placeholder="Phone"
            />
            <Upload
              showUploadList={false}
              onChange={(info) => handleEditChange("personalDetails.profilePicture", info.fileList[0]?.url || "")}
            >
              <Button>Upload Profile Picture</Button>
            </Upload>
          </div>
        </TabPane>

        {/* Address Tab */}
        <TabPane tab="Address" key="2">
          <div className="space-y-4">
            <Input
              value={formData.address.street}
              onChange={(e) => handleEditChange("address.street", e.target.value)}
              placeholder="Street"
            />
            <Input
              value={formData.address.city}
              onChange={(e) => handleEditChange("address.city", e.target.value)}
              placeholder="City"
            />
            <Input
              value={formData.address.state}
              onChange={(e) => handleEditChange("address.state", e.target.value)}
              placeholder="State"
            />
            <Input
              value={formData.address.country}
              onChange={(e) => handleEditChange("address.country", e.target.value)}
              placeholder="Country"
            />
            <Input
              value={formData.address.postalCode}
              onChange={(e) => handleEditChange("address.postalCode", e.target.value)}
              placeholder="Postal Code"
            />
          </div>
        </TabPane>

        {/* Professional Details Tab */}
        <TabPane tab="Professional Details" key="3">
          <div className="space-y-4">
            <Input
              value={formData.professionalDetails.position}
              onChange={(e) => handleEditChange("professionalDetails.position", e.target.value)}
              placeholder="Position"
            />
            <Input
              value={formData.professionalDetails.department}
              onChange={(e) => handleEditChange("professionalDetails.department", e.target.value)}
              placeholder="Department"
            />
            <Input
              value={formData.professionalDetails.workTime}
              onChange={(e) => handleEditChange("professionalDetails.workTime", e.target.value)}
              placeholder="Work Time"
            />
            <DatePicker
              onChange={(date) => handleEditChange("professionalDetails.joiningDate", date)}
              placeholder="Joining Date"
            />
            <Input
              value={formData.professionalDetails.currentStatus}
              onChange={(e) => handleEditChange("professionalDetails.currentStatus", e.target.value)}
              placeholder="Current Status"
            />
            <Input
              value={formData.professionalDetails.companyName}
              onChange={(e) => handleEditChange("professionalDetails.companyName", e.target.value)}
              placeholder="Company Name"
            />
            <Input
              value={formData.professionalDetails.salary}
              onChange={(e) => handleEditChange("professionalDetails.salary", e.target.value)}
              placeholder="Salary"
            />
            <Input
              value={formData.professionalDetails.skills.join(", ")}
              onChange={(e) => handleEditChange("professionalDetails.skills", e.target.value.split(", "))}
              placeholder="Skills (comma separated)"
            />
          </div>
        </TabPane>

        {/* Employee Credentials Tab */}
        <TabPane tab="Employee Credentials" key="4">
          <div className="space-y-4">
            <Input
              value={formData.employeeCredentials.companyEmail}
              onChange={(e) => handleEditChange("employeeCredentials.companyEmail", e.target.value)}
              placeholder="Company Email"
            />
            <Input.Password
              value={formData.employeeCredentials.companyPassword}
              onChange={(e) => handleEditChange("employeeCredentials.companyPassword", e.target.value)}
              placeholder="Company Password"
            />
          </div>
        </TabPane>

        {/* Documents Tab */}
        <TabPane tab="Documents" key="5">
          <div className="space-y-4">
            <Upload
              showUploadList={false}
              onChange={(info) => handleEditChange("documents.resume", info.fileList[0]?.url || "")}
            >
              <Button>Upload Resume</Button>
            </Upload>
            <Upload
              showUploadList={false}
              onChange={(info) => handleEditChange("documents.idProof", info.fileList[0]?.url || "")}
            >
              <Button>Upload ID Proof</Button>
            </Upload>
          </div>
        </TabPane>
      </Tabs>

      <div className="mt-4 flex justify-end">
        <motion.button
          className="bg-blue-500 text-white px-6 py-2 rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
        >
          Save Changes
        </motion.button>
      </div>
    </Modal>
  );
};

export default EmployeeModal;

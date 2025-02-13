import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, Button, Card, Badge, Pagination, Modal, Upload, message, Spin, Empty } from "antd";
import { SearchOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { employeeInstance } from "../../services/employeeInstance";

const { Option } = Select;

interface Project {
  projectId: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  managerStatus: string;
  assignedBy: string;
  assignedEmployee: {
    employeeId: string;
    employeeName: string;
    employeeFiles: { fileName: string; fileUrl: string; uploadedAt: string }[];
  };
  projectFiles: { fileName: string; fileUrl: string; uploadedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    "In Progress": "#1890ff",
    "Completed": "#52c41a",
    "Pending": "#faad14",
    "Under Evaluation": "#722ed1",
    "Rejected": "#f5222d",
    "Approved": "#52c41a"
  };
  return colors[status] || "#d9d9d9";
};

const ProjectDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeInstance.get('/employee-service/api/project/get-all-projects');
      setProjects(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to fetch projects. Please try again later.');
      } else {
        setError('Failed to fetch projects. Please try again later.');
      }
      message.error('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      setLoading(true);
      const response = await employeeInstance.patch(
        `/employee-service/api/project/update-project-status/${projectId}`,
        { status: newStatus }
      );

      if (response.data) {
        setProjects(projects.map(project =>
          project.projectId === projectId ? { ...project, status: newStatus } : project
        ));
        message.success('Project status updated successfully');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating project status:', err);
      message.error('Failed to update project status. Please try again.');
      await fetchProjects();
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (projectId: string, file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await employeeInstance.post(
        `/employee-service/api/project/update-employeefiles/${projectId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data) {
        message.success(`File ${file.name} uploaded successfully`);
        await fetchProjects();
        setSelectedProject(null);
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      message.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || p.status === statusFilter)
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h3 className="text-red-500 mb-4">{error}</h3>
          <Button type="primary" onClick={fetchProjects}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8 flex gap-4 items-center">
        <Input
          placeholder="Search projects..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow-sm"
          style={{ width: 300 }}
        />
        <Select
          defaultValue="All"
          onChange={(value) => setStatusFilter(value)}
          className="shadow-sm"
          style={{ width: 150 }}
        >
          <Option value="All">All Status</Option>
          <Option value="notStarted">Not Started</Option>
          <Option value="inProgress">In Progress</Option>
          <Option value="completed">Completed</Option>
          <Option value="onHold">On Hold</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </div>

      {projects.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Empty
            description="No projects yet added"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Empty
            description="No projects match your search criteria"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {paginatedProjects.map((project) => (
                <motion.div
                  key={project.projectId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    className="hover:shadow-xl transition-shadow duration-300"
                    style={{
                      background: 'linear-gradient(to bottom right, #ffffff, #f0f2f5)',
                      borderRadius: '12px',
                      border: '1px solid #e8e8e8'
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold truncate max-w-[60%]">
                          {project.projectName}
                        </h3>
                        <Badge color={getStatusColor(project.managerStatus)} text={project.managerStatus} />
                      </div>

                      <p className="text-gray-600 line-clamp-2">{project.description}</p>

                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                        <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                      </div>

                      <div className="flex justify-between items-center gap-2 pt-2">
                        <Select
                          value={project.status}
                          style={{ width: 130 }}
                          onChange={(value) => handleStatusChange(project.projectId, value)}
                        >
                          <Option value="notStarted">Not Started</Option>
                          <Option value="inProgress">In Progress</Option>
                          <Option value="completed">Completed</Option>
                          <Option value="onHold">On Hold</Option>
                          <Option value="cancelled">Cancelled</Option>
                        </Select>

                        <Button
                          type="primary"
                          icon={<EyeOutlined />}
                          onClick={() => setSelectedProject(project)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length > pageSize && (
            <Pagination
              current={currentPage}
              total={filteredProjects.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
              className="mt-8 flex justify-center"
            />
          )}
        </>
      )}

      <Modal
        title={selectedProject?.projectName}
        open={!!selectedProject}
        onCancel={() => setSelectedProject(null)}
        footer={null}
        width={700}
      >
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <Badge color={getStatusColor(selectedProject.managerStatus)} text={selectedProject.managerStatus} />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Project Details</h4>
              <p className="text-gray-700">{selectedProject.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {new Date(selectedProject.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium">
                    {new Date(selectedProject.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Assigned Employee</h4>
              <p>{selectedProject.assignedEmployee.employeeName}</p>
              {selectedProject.assignedEmployee.employeeFiles.length > 0 ? (
                <Button
                  onClick={() => setShowFilesModal(true)}
                  type="primary"
                  ghost
                >
                  View Employee Files
                </Button>
              ) : (
                <Upload
                  customRequest={({ file }) => {
                    if (file instanceof File) {
                      handleFileUpload(selectedProject.projectId, file);
                    } else {
                      console.error("Uploaded file is not a valid File type.");
                    }
                  }}
                  showUploadList={false}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    loading={uploading}
                  >
                    Upload Employee File
                  </Button>
                </Upload>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Project Files</h4>
              {selectedProject.projectFiles.map((file, index) => (
                <Button
                  key={index}
                  href={file.fileUrl}
                  target="_blank"
                  type="primary"
                  ghost
                >
                  {file.fileName}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </Modal>

      <Modal
        title="Employee Files"
        open={showFilesModal}
        onCancel={() => setShowFilesModal(false)}
        footer={null}
      >
        {selectedProject && (
          <div className="space-y-4">
            {selectedProject.assignedEmployee.employeeFiles.map((file, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{file.fileName}</span>
                <Button
                  href={file.fileUrl}
                  target="_blank"
                  type="primary"
                  ghost
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectDashboard;
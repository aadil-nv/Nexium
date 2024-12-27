import React, { useState, useEffect } from 'react';
import { Table, InputNumber, Button, Skeleton, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';  // Import Save icon
import axios from 'axios';  // Import axios for making API requests
import { managerInstance } from '../../../services/managerInstance';

export default function LeaveSettings() {
  // Default leave types data
  const defaultLeaveTypes = [
    { id: 1, name: 'Sick Leave', default: 0 },
    { id: 2, name: 'Casual Leave', default: 0 },
    { id: 3, name: 'Maternity Leave', default: 0 },
    { id: 4, name: 'Paternity Leave', default: 0 },
    { id: 5, name: 'Paid Leave', default: 0 },
    { id: 6, name: 'Unpaid Leave', default: 0 },
    { id: 7, name: 'Compensatory Leave', default: 0 },
    { id: 8, name: 'Bereavement Leave', default: 0 },
    { id: 9, name: 'Marriage Leave', default: 0 },
    { id: 10, name: 'Study Leave', default: 0 },
  ];

  // State to hold leave types fetched from the API or default data
  const [leaveTypes, setLeaveTypes] = useState<any[]>(defaultLeaveTypes);
  const [updatedLeaves, setUpdatedLeaves] = useState<any[]>([]); // Updated leaves for input
  const [leaveId, setLeaveId] = useState<string>(''); // To hold the ID for updating
  const [loading, setLoading] = useState<boolean>(false); // Loading state for skeleton
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>(false); // Empty data state

  // Fetch leave types from the API when the component mounts
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      setLoading(true);  // Show loading spinner
      try {
        const response = await managerInstance.get('/manager/api/leave/get-all-leavetypes');
        const leaveData = response.data[0];

        // If data is empty, set the empty state to true
        if (!leaveData) {
          setIsDataEmpty(true);
          setLoading(false);
          return;
        }

        // Set the leave types data fetched from the API
        setLeaveId(response.data[0]._id); // Store the ID for update
        delete leaveData._id;  // Remove _id from the data
        setLeaveTypes(leaveData);

        // Convert the data into an array format suitable for the Table component
        setUpdatedLeaves(
          Object.keys(leaveData).map((key) => ({
            name: key,  // Set leave type name (e.g., 'sickLeave')
            maxDays: leaveData[key],  // Set maxDays value
          }))
        );
      } catch (error) {
        console.error('Error fetching leave types:', error);
      } finally {
        setLoading(false);  // Hide loading spinner after fetching data
      }
    };

    fetchLeaveTypes();
  }, []);  // Empty dependency array to run only once when component mounts

  // Handler for updating maxDays
  const handleUpdate = (name: string, newCount: number) => {
    setUpdatedLeaves((prev) =>
      prev.map((leave) =>
        leave.name === name ? { ...leave, maxDays: newCount } : leave
      )
    );
  };

  // Function to save changes to the API
  const saveChanges = async () => {
    setLoading(true); // Show loading spinner while saving
    try {
      // Prepare the updated leave types in the correct format for the API
      const updatedData = updatedLeaves.reduce((acc: any, leave: any) => {
        acc[leave.name] = leave.maxDays;
        return acc;
      }, {});

      // Send the updated leave types to the API
      await managerInstance.post(`/manager/api/leave/update-leavetypes/${leaveId}`, updatedData);
      message.success('Leave Types Updated Successfully!'); // Success message
      setLeaveTypes(updatedData); // Update state with the new data
    } catch (error) {
      console.error('Error updating leave types:', error);
      message.error('Error updating leave types!'); // Error message
    } finally {
      setLoading(false); // Hide loading spinner after saving
    }
  };

  const columns = [
    {
      title: 'Leave Type',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Max Days',
      dataIndex: 'maxDays',
      key: 'maxDays',
      render: (value: number, record: any) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(newValue) => handleUpdate(record.name, newValue!)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      {/* Heading with custom color */}
      <h2 style={{ 
        marginBottom: '20px', 
        textAlign: 'center', 
        color: '#1890ff'  // Set heading color to blue
      }}>
        Leave Settings
      </h2>

      {/* Button placed in the top right corner */}
      <Button
        type="primary"
        icon={<SaveOutlined />}  // Add icon inside the button
        onClick={saveChanges}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 10,  // Ensure the button is always on top
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#52c41a',  // Green button color
          borderColor: '#52c41a',
        }}
        loading={loading} // Show loading spinner on the button
      >
        Save Changes
      </Button>

      {/* Show Skeleton while loading */}
      {loading ? (
        <Skeleton active />
      ) : (
        // Table for leave types
        <Table
          dataSource={updatedLeaves.length > 0 ? updatedLeaves : leaveTypes}
          columns={columns}
          rowKey="name"  // Set rowKey to 'name' because we don't have an 'id'
          pagination={false}
          style={{ marginTop: '60px' }}  // Adjust margin so it doesn't overlap the button
          locale={{ emptyText: isDataEmpty ? 'No leave types available' : 'No data' }} // Empty data message
        />
      )}
    </div>
  );
}

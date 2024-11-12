import React, { useState } from 'react';
import axios from 'axios';
import { privateApi } from '../../../services/axiosConfig';

// Define the type for the form data
type FormData = {
  name: string;
  email: string;
  position: string;
  phone: string;
  employeeId: string;
  salary: string;
  workTime: string;
  joiningDate: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  companyEmail: string;
  companyPassword: string;
  documentName?: string; // Optional property
};

const ManagerForm = () => {
  // State to hold form data
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    position: '',
    phone: '',
    employeeId: '',
    salary: '',
    workTime: '',
    joiningDate: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    companyEmail: '',
    companyPassword: '',
    documentName: '', // Optional property
  });

  // Function to populate form with demo data
  const populateFormWithDemoData = () => {
    setFormData({
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Manager',
      phone: '123-456-7890',
      employeeId: '12345',
      salary: '50000',
      workTime: 'Full-time',
      joiningDate: '2022-01-01',
      street: '123 Main St',
      city: 'Some City',
      state: 'Some State',
      zip: '12345',
      country: 'Country',
      companyEmail: 'company@example.com',
      companyPassword: 'password123',
      documentName: 'Example Document', // Optional
    });
  };

  // Handle form submission with Axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Send data to the API with credentials (cookies, etc.)
      const response = await privateApi.post(
        '/manager/add-managers', 
        formData,
        { withCredentials: true } // Enable sending cookies with the request
      );
      console.log('Manager added successfully:', response.data);
    } catch (error) {
      console.error('Error adding manager:', error);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block">Name</label>
            <input
              type="text"
              id="name"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email" className="block">Email</label>
            <input
              type="email"
              id="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="position" className="block">Position</label>
            <input
              type="text"
              id="position"
              className="input"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block">Phone</label>
            <input
              type="text"
              id="phone"
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="employeeId" className="block">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              className="input"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="salary" className="block">Salary</label>
            <input
              type="text"
              id="salary"
              className="input"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="workTime" className="block">Work Time</label>
            <input
              type="text"
              id="workTime"
              className="input"
              value={formData.workTime}
              onChange={(e) => setFormData({ ...formData, workTime: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="joiningDate" className="block">Joining Date</label>
            <input
              type="date"
              id="joiningDate"
              className="input"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="street" className="block">Street</label>
            <input
              type="text"
              id="street"
              className="input"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="city" className="block">City</label>
            <input
              type="text"
              id="city"
              className="input"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="state" className="block">State</label>
            <input
              type="text"
              id="state"
              className="input"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="zip" className="block">Zip</label>
            <input
              type="text"
              id="zip"
              className="input"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="country" className="block">Country</label>
            <input
              type="text"
              id="country"
              className="input"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="companyEmail" className="block">Company Email</label>
            <input
              type="email"
              id="companyEmail"
              className="input"
              value={formData.companyEmail}
              onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="companyPassword" className="block">Company Password</label>
            <input
              type="password"
              id="companyPassword"
              className="input"
              value={formData.companyPassword}
              onChange={(e) => setFormData({ ...formData, companyPassword: e.target.value })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          Add Manager
        </button>
      </form>

      {/* Refresh Button */}
      <button
        onClick={populateFormWithDemoData}
        className="mt-4 ml-2 p-2 bg-green-500 text-white rounded"
      >
        Refresh with Demo Data
      </button>
    </div>
  );
};

export default ManagerForm;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { privateApi } from '../../../services/axiosConfig';
import { motion } from 'framer-motion';

const ManagerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    managerType: '',
    email: '',
    phoneNumber: '',
  
    joiningDate: '',
    companyLogo: '',
    profileImage: '',
    salary: 0,
    workTime: '',
  });

  const fields = [
    { id: 'name', label: 'Manager Name', type: 'text' },
    { id: 'managerType', label: 'Manager Type', type: 'select', options: ["HumanResourceManager" ,"GeneralManager" ,"ProjectManager" , "SalesManager"] },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { id: 'joiningDate', label: 'Date of join', type: 'date' },
    { id: 'salary', label: 'Salary', type: 'number' },
    { id: 'workTime', label: 'Work Time', type: 'select', options: ["Full-Time", "Part-Time", "Contract", "Temporary"] },
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSend = {
      ...formData,
      phone: formData.phoneNumber,
      documents: [],
      companyCredentials: {
        companyName: '',
        companyRegistrationNumber: '',
        email: '',
        password: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
    };
  
    try {
      const response = await privateApi.post('/manager/add-managers', dataToSend);
      if (response.status === 200) {
        toast.success('Form submitted successfully!');
        setFormData({
          name: '',
          managerType: '',
          email: '',
          phoneNumber: '',
          joiningDate: '',
          companyLogo: '',
          profileImage: '',
          salary: 0,
          workTime: '',
        });
      } else {
        toast.error('Failed to submit the form!');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the form!');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {fields.map((field, index) => (
          index % 2 === 0 ? (
            <div className="flex gap-4" key={index}>
              <motion.div layout className="flex-1">
                <label htmlFor={field.id} className="block text-gray-700">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    className="w-full p-2 border rounded"
                    value={formData[field.id]}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Work Time</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    className="w-full p-2 border rounded"
                    value={formData[field.id]}
                    onChange={handleInputChange}
                  />
                )}
              </motion.div>
              {fields[index + 1]?.id && (
                <motion.div layout className="flex-1">
                  <label htmlFor={fields[index + 1].id} className="block text-gray-700">{fields[index + 1]?.label}</label>
                  {fields[index + 1]?.type === 'select' ? (
                    <select
                      id={fields[index + 1].id}
                      className="w-full p-2 border rounded"
                      value={formData[fields[index + 1].id]}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Work Time</option>
                      {fields[index + 1].options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={fields[index + 1]?.type}
                      id={fields[index + 1].id}
                      className="w-full p-2 border rounded"
                      value={formData[fields[index + 1].id]}
                      onChange={handleInputChange}
                    />
                  )}
                </motion.div>
              )}
            </div>
          ) : null
        ))}
        <motion.button 
          type="submit" 
          className="w-full p-2 bg-blue-500 text-white rounded"
          whileHover={{ scale: 1.05 }}
        >
          Submit
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ManagerForm;

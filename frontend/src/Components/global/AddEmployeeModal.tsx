import React, { useState, useEffect } from 'react'; 
import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { toast } from 'react-toastify';
import { addEmployee } from '../../api/managerApi'; // Removed fetchDepartments import as it is no longer needed
import { addEmployeeSchema } from '../../config/validationSchema'; 
import { useForm } from 'antd/lib/form/Form';

const { Option } = Select;

const useStyle = createStyles(({ token }) => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-header': {
    borderBottom: `1px dotted ${token.colorPrimary}`,
  },
  'my-modal-footer': {
    color: token.colorPrimary,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const AddEmployeeModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const { styles } = useStyle();
  const token = useTheme();
  const themeColor = useSelector((state: RootState) => state.menu.themeColor);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phoneNumber: '',
    joiningDate: '',
    salary: 0,
    workTime: '',
  });

  const [form] = useForm(); 

  const classNames = {
    body: styles['my-modal-body'],
    mask: styles['my-modal-mask'],
    header: styles['my-modal-header'],
    footer: styles['my-modal-footer'],
    content: styles['my-modal-content'],
  };

  const modalStyles = {
    header: {
      borderLeft: `5px solid ${token.colorPrimary}`,
      borderRadius: 0,
      paddingInlineStart: 5,
    },
    mask: {
      backdropFilter: 'blur(10px)',
    },
    footer: {
      borderTop: '1px solid #333',
    },
    content: {
      boxShadow: '0 0 30px #999',
    },
  };

  const fields = [
    { id: 'name', label: 'Employee Name', type: 'text' },
    { id: 'position', label: 'Position', type: 'select', options: ["Team Lead", "Senior Software Engineer", "Junior Software Engineer"] },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { id: 'joiningDate', label: 'Date of Join', type: 'date' },
    { id: 'salary', label: 'Salary', type: 'number' },
    { id: 'workTime', label: 'Work Time', type: 'select', options: ["Full-Time", "Part-Time", "Contract", "Temporary"] },
  ];

  const handleSubmit = async () => {
    const formValues = form.getFieldsValue();
    const validation = addEmployeeSchema.safeParse(formValues);

    if (validation.success) {
      const employeeData = {
        name: formValues.name,
        position: formValues.position,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        salary: Number(formValues.salary),
        workTime: formValues.workTime,
        joiningDate: formValues.joiningDate,
      };

      try {
        const success = await addEmployee(employeeData); 
        if (success) {
          setFormData({
            name: '',
            position: '',
            email: '',
            phoneNumber: '',
            joiningDate: '',
            salary: 0,
            workTime: '',
          });
          onClose();
        }
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    } else {
      form.setFields(
        validation.error.errors.map((err) => ({
          name: err.path[0],
          errors: [err.message],
        }))
      );
    }
  };

  return (
    <Modal
      title="Add Employee"
      open={isVisible}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      classNames={classNames}
      styles={modalStyles}
    >
      <Form
        layout="horizontal"
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => console.log('Failed:', errorInfo)}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={[{ required: true, message: `Please input ${field.label.toLowerCase()}!` }]}>

            {field.type === 'select' ? (
              <Select
                placeholder={`Select ${field.label}`}
                onChange={(value) => setFormData({ ...formData, [field.id]: value })}
              >
                {field.options?.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            ) : field.type === 'date' ? (
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date) => setFormData({ ...formData, [field.id]: date })}
              />
            ) : field.type === 'number' ? (
              <Input
                type="number"
                placeholder={`Enter ${field.label}`}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              />
            ) : (
              <Input
                placeholder={`Enter ${field.label}`}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;

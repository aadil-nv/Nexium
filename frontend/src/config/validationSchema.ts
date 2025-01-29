// validationSchema.ts
import { z } from 'zod';

// Password regex: At least 6 characters, one uppercase letter, one number, and one symbol
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const companyNameRegex = /^[A-Za-z0-9 ]{3,}$/;
const invalidPhoneNumbers = ['1234567890', '0987654321'];

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }), // Validates proper email format
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' }) // Minimum 6 characters
    // .regex(passwordRegex, { message: 'Password must contain at least one uppercase letter, one number, and one symbol' }), // Regex validation
});

export const signUpSchema = z.object({
  companyName: z
    .string()
    .min(3, 'Company name must be at least 3 characters long')
    .regex(companyNameRegex, 'Company name must not contain special characters'),
  
  email: z.string().email('Invalid email address'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(passwordRegex, 'Password must contain at least one uppercase letter, one number, and one symbol'),

  confirm_password: z
    .string()
    .min(6, 'Confirm password is required'),

  phone: z
    .string()
    .length(10, 'Phone number must be exactly 10 digits')
    .refine((phone) => !invalidPhoneNumbers.includes(phone), {
      message: 'Phone number is invalid',
    }),

  registrationNumber: z
    .string()
    .min(6, 'Registration number must be at least 6 characters'),
  
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});



export const managerSchema = z.object({
  name: z
    .string()
    .min(3, 'Manager name must be at least 3 characters long')
    .nonempty('Manager name is required'),

  email: z
    .string()
    .email('Invalid email address'),

  phoneNumber: z
    .string()
    .length(10, 'Phone number must be exactly 10 digits'),

  joiningDate: z
    .string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate >= today;
    }, 'Joining date must be today or a future date'),

  salary: z
    .string()
    .min(1, 'Salary must be greater than 0'),

  workTime: z
    .string()
    .nonempty('Work time is required'),

  managerType: z
    .string()
    .nonempty('Manager type is required'),
});

export const addEmployeeSchema = z.object({
  name: z.string().min(3, 'Employee name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .length(10, 'Phone number must be exactly 10 digits'),
  
  salary: z
    .string()
    .min(1, 'Salary must be a valid number')
    .regex(/^\d+$/, 'Salary must be a valid number'),
  workTime: z.string().nonempty('Work time is required'),
  
});

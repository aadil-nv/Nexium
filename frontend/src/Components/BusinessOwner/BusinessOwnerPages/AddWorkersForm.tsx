import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Success/Error icons

// Zod schema for validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  role: z.enum(['HR', 'Manager', 'Team Lead'], { errorMap: () => ({ message: 'Invalid role selected' }) })
});

type FormData = z.infer<typeof formSchema>;

export default function AddWorkersForm() {
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset(); // Optionally reset form after submission
  };

  return (
    <div className="min-h-screen bg-gray-00 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Add HR Worker</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-medium mb-2">Name</label>
            <input
              {...register('name')}
              id="name"
              placeholder="Enter full name"
              className={`text-gray-800 p-3 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-00 focus:ring-indigo-500'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1"><FaExclamationCircle className="inline mr-1" /> {errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-medium mb-2">Email</label>
            <input
              {...register('email')}
              id="email"
              placeholder="Enter email address"
              className={`text-gray-800 p-3 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1"><FaExclamationCircle className="inline mr-1" /> {errors.email.message}</p>}
          </div>

          {/* Phone Input */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              {...register('phone')}
              id="phone"
              placeholder="Enter phone number"
              className={`text-gray-800 p-3 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1"><FaExclamationCircle className="inline mr-1" /> {errors.phone.message}</p>}
          </div>

          {/* Role (Select Input) */}
          <div className="flex flex-col">
            <label htmlFor="role" className="text-gray-900 font-medium mb-2">Role</label>
            <select
              {...register('role')}
              id="role"
              className={`text-gray-800 p-3 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${errors.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
            >
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Team Lead">Team Lead</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1"><FaExclamationCircle className="inline mr-1" /> {errors.role.message}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            {isSubmitSuccessful ? <FaCheckCircle className="inline mr-2" /> : null} Add Worker
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { employeeInstance } from "../../services/employeeInstance";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

type EmployeeProfile = {
  employeeName: string;
  email: string;
  phone: string;
  profilePicture: string;
};

export default function Dashboard() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {employee} = useAuth();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await employeeInstance.get<EmployeeProfile>("/employee/api/employee/get-profile");
        setProfile(response.data);
      } catch (err) {
        setError((err as any).response?.data?.message || "Failed to fetch profile data");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl text-red-800">Dashboard</h1>
      <div className="mt-4 bg-white shadow-md p-4 rounded">
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto"
        />
        <h2 className="text-lg font-semibold text-center mt-4">{profile.employeeName}</h2>
        <p className="text-center text-gray-600">{profile.email}</p>
        <p className="text-center text-gray-600">{profile.phone}</p>
      </div>

      <div>
        <p className="text-center text-red-700">Employee Name ==={employee.employeeName }</p>
        <p className="text-center text-red-700">Employee ProfilePicyre==={employee.employeeProfilePicture }</p>
        <p className="text-center text-red-700">Employee employeeType=={employee.employeeType }</p>
        <p className="text-center text-red-700">Employee companyLogo==={employee.companyLogo }</p>
        <p className="text-center text-red-700">Employee comanyName==={employee.companyName }</p>
        <p className="text-center text-red-700">WOrk time ==={employee.workTime }</p>
      </div>
    </div>
  );
}

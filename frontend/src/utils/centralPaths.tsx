import React from 'react';
import PersonalDetailes from '../components/global/PersonalDetailes';
import ProffessionalDetiles from '../components/global/ProffessionalDetiles';
import Address from '../components/global/Address';
import Documents from '../components/global/Documents';
import Securitie from '../components/global/Securitie';
import CompanyDetails from '../components/global/CompanyDetailes';
import { EditOutlined } from "@ant-design/icons";


interface LinkItem {
  title: string;
  route: string;
  icon: string;
  hasSubMenu?: boolean;
  subLinks?: LinkItem[];
}


export const businessOwnerLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/business-owner/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Managers', route: '/business-owner/employees', icon: 'fi fi-tr-employees' },
  { title: 'Subscriptions', route: '/business-owner/subscriptions', icon: 'fi fi-tr-benefit' },
  { title: 'Service Requests', route: '/business-owner/service-requests', icon: 'fi fi-tr-user-headset' },
  // { title: 'Notifications', route: '/business-owner/notifications', icon: 'fi fi-tr-bells' },
  { title: 'Announcements', route: '/business-owner/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'Chat', route: '/business-owner/chat', icon: 'fi fi-tr-messages' },
  { title: 'Meetings', route: '/business-owner/meeting', icon: 'fi fi-tr-circle-video' },
];

export const superAdminLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/super-admin/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Business Owners', route: '/super-admin/businessowners', icon: 'fi fi-tr-corporate-alt' },
  { title: 'Subscription Plans', route: '/super-admin/plans', icon: 'fi fi-tr-features' },
  // { title: 'Notifications', route: '/super-admin/notifications', icon: 'fi fi-tr-bells' },
  { title: 'Announcements', route: '/super-admin/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'Customer Support', route: '/super-admin/service-requests', icon: 'fi fi-tr-user-headset' },
];

export const teamLeedLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/employee/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Attendance', route: '/employee/attendance', icon: 'fi fi-tr-skill' },
  { title: 'Department', route: '/employee/team', icon: 'fi fi-tr-department-structure' },
  { title: 'Tasks', route: '/employee/tasks', icon: 'fi fi-tr-responsability' } ,
  { title: 'Payroll', route: '/employee/payroll', icon: 'fi fi-tr-payroll' },
  // { title: 'Announcements', route: '/employee/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'Chat', route: '/employee/chat', icon: 'fi fi-tr-messages' },
  { title: 'Meetings', route: '/employee/meeting', icon: 'fi fi-tr-circle-video' },
  { title: 'Leaves', route: '/employee/leaves', icon: 'fi fi-tr-house-leave' },


];
export const employeeLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/employee/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Attendance', route: '/employee/attendance', icon: 'fi fi-tr-skill' },
  { title: 'Department', route: '/employee/team', icon: 'fi fi-tr-department-structure' },
  { title: 'My Tasks', route: '/employee/task-list', icon: 'fi fi-tr-web-test' },
  { title: 'Payroll', route: '/employee/payroll', icon: 'fi fi-tr-payroll' },
  // { title: 'Announcements', route: '/employee/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'Chat', route: '/employee/chat', icon: 'fi fi-tr-messages' },
  { title: 'Meetings', route: '/employee/meeting', icon: 'fi fi-tr-circle-video' },
  { title: 'Leaves', route: '/employee/leaves', icon: 'fi fi-tr-house-leave' },

];

export const managerLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/manager/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Employees', route: '/manager/employees', icon: 'fi fi-tr-employees' },
  { title: 'Departments', route: '/manager/departments', icon: 'fi fi-tr-department-structure' },
  { title: 'Leaves', route: '/manager/leaves', icon: 'fi fi-tr-house-leave' },
  { title: 'Announcements', route: '/manager/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'Chat', route: '/manager/chat', icon: 'fi fi-tr-messages' },
  { title: 'Meetings', route: '/manager/meeting', icon: 'fi fi-tr-circle-video' },
  { title: 'Payroll Settings', route: '/manager/payroll-settings', icon: "fi fi-tr-calendar-salary" },
  { title: 'Leave Settings', route: '/manager/leave-settings', icon: 'fi fi-tr-spring-calendar' },
  { title: 'Pre Applied Leaves', route: '/manager/pre-applied-leaves', icon: 'fi fi-tr-spring-calendar' },

];
  




export const businessOwnerTabs = [
  { key: "1", tab: "Personal Details", component: <PersonalDetailes /> },
  { key: "2", tab: "Company Details", component: <CompanyDetails /> },
  { key: "3", tab: "Address", component: <Address /> },
  { key: "4", tab: "Documents", component: <Documents /> },
  

];
export const superAdminTabs = [
  { key: "1", tab: "Personal Details", component: <PersonalDetailes /> },
  { key: "2", tab: "Professional Details", component: <ProffessionalDetiles /> },
  { key: "3", tab: "Address", component: <Address /> },

];
export const managerTabs = [
  { key: "1", tab: "Personal Details", component: <PersonalDetailes /> },
  { key: "2", tab: "Professional Details", component: <ProffessionalDetiles /> },
  { key: "3", tab: "Address", component: <Address /> },
  { key: "4", tab: "Documents", component: <Documents /> },
  { key: "5", tab: "Securities", component: <Securitie /> },
];
export const employeeTabs = [
  { key: "1", tab: "Personal Details", component: <PersonalDetailes /> },
  { key: "2", tab: "Professional Details", component: <ProffessionalDetiles /> },
  { key: "3", tab: "Address", component: <Address /> },
  { key: "4", tab: "Documents", component: <Documents /> },
  { key: "5", tab: "Securities", component: <Securitie /> },
];



export const tabConfigurations = [
  {
    key: "1",
    tab: "Personal Details",
    fields: [
      { label: "Profile Picture", name: "profilePicture", placeholder: "Upload your profile picture", type: "file", icon: <EditOutlined /> },
      { label: "Full Name", name: "fullName", placeholder: "Enter your full name", type: "text" },
      { label: "Email", name: "email", placeholder: "Enter your email", type: "text" },
      { label: "Phone", name: "phone", placeholder: "Enter your phone", type: "text" },
    ],
  },
  {
    key: "2",
    tab: "Professional Details",
    fields: [
      { label: "Position", name: "jobTitle", placeholder: "Enter your Position", type: "text" },
      { label: "Work Time", name: "workTime", placeholder: "Enter your workTime", type: "text" },
      { label: "Salary", name: "salary", placeholder: "Enter your salary", type: "text" },
      { label: "Joining Date", name: "dateOfJoin", placeholder: "Enter your joining date", type: "text" },
      { label: "Department", name: "department", placeholder: "Enter your department", type: "text" },
      { label: "Current Status", name: "currentStatus", placeholder: "Enter your current status", type: "text" },
      { label: "Company Name", name: "companyName", placeholder: "Enter your company name", type: "text" },
      { label: "Skills", name: "skills", placeholder: "Enter your skills", type: "text" },
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
    tab: "Documents",
    fields: [
      { label: "Upload ID", name: "uploadId", placeholder: "", type: "file" },
      { label: "Upload Resume", name: "uploadAddressProof", placeholder: "", type: "file" },
    ],
  },
  {
    key: "5",
    tab: "Security",
    fields: [
      { label: "Company Email", name: "companyEmail", placeholder: "Enter old password", type: "text" },
      { label: "Company Password", name: "companyPassword", placeholder: "Enter new password", type: "password" },
    ],
  }
  // Other tabs here...
];

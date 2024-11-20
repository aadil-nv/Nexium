import React from 'react';
import PersonalDetailes from '../components/global/PersonalDetailes';
import ProffessionalDetiles from '../components/global/ProffessionalDetiles';
import Address from '../components/global/Address';
import Documents from '../components/global/Documents';
import Securitie from '../components/global/Securitie';

interface LinkItem {
  title: string;
  route: string;
  icon: string;
  hasSubMenu?: boolean;
  subLinks?: LinkItem[];
}


export const businessOwnerLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/business-owner/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Employees', route: '/business-owner/employees', icon: 'fi fi-tr-employees' },
  { title: 'Subscriptions', route: '/business-owner/subscriptions', icon: 'fi fi-tr-benefit' },
  { title: 'Service Requests', route: '/business-owner/service-requests', icon: 'fi fi-tr-user-headset' },
  { title: 'Notifications', route: '/business-owner/notifications', icon: 'fi fi-tr-bells' },
  { title: 'Announcements', route: '/business-owner/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'demo', route: '/business-owner/demo', icon: 'fi fi-tr-megaphone-announcement-leader' },
];

export const superAdminLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/super-admin/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Business Owners', route: '/super-admin/businessowners', icon: 'fi fi-tr-corporate-alt' },
  { title: 'Subscription Plans', route: '/super-admin/plans', icon: 'fi fi-tr-features' },
  { title: 'Notifications', route: '/super-admin/notifications', icon: 'fi fi-tr-bells' },
  { title: 'Announcements', route: '/super-admin/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'Customer Support', route: '/super-admin/service-requests', icon: 'fi fi-tr-user-headset' },
];

export const employeeLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/manager/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Employees', route: '/manager/employees', icon: 'fi fi-tr-employees' },
  { title: 'Departments', route: '/manager/departments', icon: 'fi fi-tr-department-structure' },
  { title: 'Attendance', route: '/manager/attendances', icon: 'fi fi-tr-skill' },
  { title: 'Payroll', route: '/manager/payroll', icon: 'fi fi-tr-payroll' },
  {title: 'Onboarding',route: '/manager/onboarding-employee-list',icon: 'fi fi-tr-onboarding',
    hasSubMenu: true,subLinks: [
      { title: 'Pre Boarding', route: '/manager/pre-boarding', icon: 'fi fi-tr-skill' },
      { title: 'Interview', route: '/manager/interview', icon: 'fi fi-tr-chart-user' },]
  },
  { title: 'Leaves', route: '/manager/leaves', icon: 'fi fi-tr-house-leave' },
  { title: 'Notifications', route: '/manager/notifications', icon: 'fi fi-tr-bells' },
  { title: 'Announcements', route: '/manager/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'Service Requests', route: '/manager/service-requests', icon: 'fi fi-tr-hr-group' },
];

export const managerLinks: LinkItem[] = [
  { title: 'Dashboard', route: '/manager/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
  { title: 'Employees', route: '/manager/employees', icon: 'fi fi-tr-employees' },
  { title: 'Departments', route: '/manager/departments', icon: 'fi fi-tr-department-structure' },
  { title: 'Attendance', route: '/manager/attendances', icon: 'fi fi-tr-skill' },
  { title: 'Payroll', route: '/manager/payroll', icon: 'fi fi-tr-payroll' },
  {title: 'Onboarding',route: '/manager/onboarding-employee-list',icon: 'fi fi-tr-onboarding',
    hasSubMenu: true,subLinks: [
      { title: 'Pre Boarding', route: '/manager/pre-boarding', icon: 'fi fi-tr-skill' },
      { title: 'Interview', route: '/manager/interview', icon: 'fi fi-tr-chart-user' },]
  },
  { title: 'Leaves', route: '/manager/leaves', icon: 'fi fi-tr-house-leave' },
  { title: 'Notifications', route: '/manager/notifications', icon: 'fi fi-tr-bells' },
  { title: 'Announcements', route: '/manager/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  { title: 'Service Requests', route: '/manager/service-requests', icon: 'fi fi-tr-hr-group' },
];

export const businessOwnerTabs = [
  { key: "1", tab: "Personal Details", component: <PersonalDetailes /> },
  { key: "3", tab: "Address", component: <Address /> },
  { key: "4", tab: "Documents", component: <Documents /> },
  { key: "5", tab: "Securities", component: <Securitie /> },
];
export const superAdminTabs = [
  { key: "1", tab: "Personal Details", component: <PersonalDetailes /> },
  { key: "2", tab: "Professional Details", component: <ProffessionalDetiles /> },
  { key: "3", tab: "Address", component: <Address /> },
  { key: "4", tab: "Documents", component: <Documents /> },
  { key: "5", tab: "Securities", component: <Securitie /> },
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



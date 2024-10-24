
interface LinkItem {
    title: string;
    route: string;
    icon: string;
  }
  

  export const businessOwnerLinks: LinkItem[] = [
    { title: 'Dashboard', route: '/business-owner/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
    { title: 'Employees', route: '/business-owner/workers', icon: 'fi fi-tr-employees' },
    { title: 'Subscriptions', route: '/business-owner/subscriptions', icon: 'fi fi-tr-benefit' },
    { title: 'Service Requests', route: '/business-owner/service-requests', icon: 'fi fi-tr-user-headset' },
    { title: 'Notifications', route: '/business-owner/notifications', icon: 'fi fi-tr-bells' },
    { title: 'Announcements', route: '/business-owner/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  ];
  

  export const superAdminLinks: LinkItem[] = [
    { title: 'Dashboard', route: '/super-admin/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
    { title: 'Plans', route: '/super-admin/plans', icon: 'fi fi-tr-features' },
    { title: 'Customer Support', route: '/super-admin/service-requests', icon: 'fi fi-tr-user-headset' },
    { title: 'Companies', route: '/super-admin/companies', icon: 'fi fi-tr-corporate-alt' },
    { title: 'Notifications', route: '/super-admin/notifications', icon: 'fi fi-tr-bells' },
    { title: 'Announcements', route: '/super-admin/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
  ];


  export const hrManagerLinks: LinkItem[] = [
    { title: 'Dashboard', route: '/hr-manager/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
    { title: 'Employees', route: '/hr-manager/employees', icon: 'fi fi-tr-employees' },
    { title: 'Attendance', route: '/hr-manager/attendance', icon: 'fi fi-tr-calendar-attendance' },
    { title: 'Payroll', route: '/hr-manager/payroll', icon: 'fi fi-tr-payroll' },
    { title: 'Departments', route: '/hr-manager/performance-reviews', icon: 'fi fi-tr-reviews' },
    { title: 'Onboarding', route: '/hr-manager/performance-reviews', icon: 'fi fi-tr-reviews' },
    { title: 'Leaves', route: '/hr-manager/performance-reviews', icon: 'fi fi-tr-reviews' },
    { title: 'Notifications', route: '/hr-manager/notifications', icon: 'fi fi-tr-bells' },
    { title: 'Announcements', route: '/hr-manager/announcements', icon: 'fi fi-tr-megaphone-announcement-leader' },
    { title: 'Service Requests', route: '/hr-manager/service-requests', icon: 'fi fi-tr-megaphone-announcement-leader' },
  ];
  
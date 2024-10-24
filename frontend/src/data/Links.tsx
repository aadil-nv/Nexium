
interface LinkItem {
    title: string;
    route: string;
    icon: string;
  }
  

  export const businessOwnerLinks: LinkItem[] = [
    { title: 'Dashboard', route: '/business-owner/dashboard', icon: 'fi fi-tr-dashboard-monitor' },
    { title: 'Subscriptions', route: '/business-owner/subscriptions', icon: 'fi fi-tr-benefit' },
    { title: 'Service Requests', route: '/business-owner/service-requests', icon: 'fi fi-tr-user-headset' },
    { title: 'Users', route: '/business-owner/workers', icon: 'fi fi-tr-employees' },
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
  
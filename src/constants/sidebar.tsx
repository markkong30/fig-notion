import { IconBrandTabler, IconCreditCard } from '@tabler/icons-react';
import { AppWindow, FileText, Images, Users } from 'lucide-react';

export const iconProps = {
  className: 'text-foreground h-5 w-5 flex-shrink-0',
};

export const getSidebarItems = () => [
  {
    id: 'application',
    section: 'Application',
    links: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <IconBrandTabler {...iconProps} />,
      },
      {
        label: 'Web Builder',
        href: '/builder',
        icon: <AppWindow {...iconProps} />,
      },
      {
        label: 'Documents',
        href: '/documents',
        icon: <FileText {...iconProps} />,
      },
      {
        label: 'Assets Gallery',
        href: '/assets',
        icon: <Images {...iconProps} />,
      },
    ],
  },
  {
    id: 'user-profile',
    section: 'User Profile',
    links: [
      {
        label: 'Workspace',
        href: '/workspace',
        icon: <Users {...iconProps} />,
      },
      {
        label: 'Billing',
        href: '/billing',
        icon: <IconCreditCard {...iconProps} />,
      },
    ],
  },
];

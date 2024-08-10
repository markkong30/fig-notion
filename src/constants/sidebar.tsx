import { IconBrandTabler, IconCreditCard } from '@tabler/icons-react';
import { AppWindow, FileText, Images, Users } from 'lucide-react';

export const iconProps = {
  className: 'text-foreground h-5 w-5 flex-shrink-0',
};

export const sidebarItems = [
  {
    id: 'application',
    section: 'Application',
    links: [
      {
        label: 'Dashboard',
        href: '#',
        icon: <IconBrandTabler {...iconProps} />,
      },
      {
        label: 'Web Builder',
        href: '#',
        icon: <AppWindow {...iconProps} />,
      },
      {
        label: 'Documents',
        href: '#',
        icon: <FileText {...iconProps} />,
      },
      {
        label: 'Assets Gallery',
        href: '#',
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
        href: '#',
        icon: <Users {...iconProps} />,
      },
      {
        label: 'Billing',
        href: '#',
        icon: <IconCreditCard {...iconProps} />,
      },
    ],
  },
];

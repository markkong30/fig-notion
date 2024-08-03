import { Metadata } from 'next';

export const SITE_CONFIG: Metadata = {
  title: {
    default: 'FigNotion - AI Powered website builder & document editor',
    template: `%s | FigNotion`,
  },
  description:
    'FigNotion is an AI powered website builder that helps you create a website in minutes. No coding skills required. Get started for free!',
  icons: {
    icon: [
      {
        url: '/icons/favicon.ico',
        href: '/icons/favicon.ico',
      },
    ],
  },
};

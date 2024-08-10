'use client';

import React, { FC, ReactNode, useState } from 'react';
import {
  Sidebar as SidebarWrapper,
  SidebarBody,
  SidebarLink,
} from '../ui/sidebar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useClerk, UserButton } from '@clerk/nextjs';
import { iconProps, sidebarItems } from '@/constants/sidebar';
import { LogOutIcon } from 'lucide-react';

type Props = {
  children: ReactNode;
};

const Sidebar: FC<Props> = ({ children }) => {
  const { user, openUserProfile, signOut } = useClerk();
  const [open, setOpen] = useState(false);

  const onSignOut = async () => {
    await signOut({
      redirectUrl: '/',
    });
  };

  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'w-full h-full',
      )}
    >
      <SidebarWrapper open={open} setOpen={setOpen}>
        <SidebarBody className='justify-between gap-10'>
          <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
            {open ? <Logo /> : <LogoIcon />}
            <div className='mt-8 flex flex-col gap-16'>
              {sidebarItems.map(item => (
                <div key={item.id}>
                  <div
                    className={cn(
                      'text-foreground font-semibold text-xs mb-2 whitespace-pre',
                      !open && 'opacity-0',
                    )}
                  >
                    {item.section}
                  </div>

                  {item.links.map((link, idx) => (
                    <div key={idx} className='flex flex-col gap-2'>
                      <SidebarLink link={link} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col'>
            <SidebarLink
              className='-ml-1.5'
              link={{
                label: user?.fullName ?? '',
                href: '#',
                icon: <UserButton />,
              }}
              isButton
              onClick={openUserProfile}
            />
            <SidebarLink
              link={{
                label: 'Logout',
                href: '#',
                icon: <LogOutIcon {...iconProps} />,
              }}
              isButton
              onClick={onSignOut}
            />
          </div>
        </SidebarBody>
      </SidebarWrapper>
      {children}
    </div>
  );
};
export const Logo = () => {
  return (
    <Link
      href='#'
      className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'
    >
      <div className='h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0' />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='font-medium text-black dark:text-white whitespace-pre'
      >
        Test Workspace
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href='#'
      className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'
    >
      <div className='h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0' />
    </Link>
  );
};

export default Sidebar;

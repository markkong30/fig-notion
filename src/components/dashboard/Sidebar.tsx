'use client';

import React, { FC, ReactNode, useState } from 'react';
import {
  Sidebar as SidebarWrapper,
  SidebarBody,
  SidebarLink,
} from '../ui/sidebar';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useClerk, UserButton } from '@clerk/nextjs';
import { getSidebarItems, iconProps } from '@/constants/sidebar';
import { LogOutIcon } from 'lucide-react';
import { Workspace } from '@prisma/client';
import Image from 'next/image';

type Props = {
  workspace: Workspace;
  children: ReactNode;
};

const Sidebar: FC<Props> = ({ workspace, children }) => {
  const { user, openUserProfile, signOut } = useClerk();
  const [open, setOpen] = useState(false);

  const sidebarItems = getSidebarItems();

  const onSignOut = async () => {
    await signOut({
      redirectUrl: '/',
    });
  };

  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-950 flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'w-full h-full',
      )}
    >
      <SidebarWrapper open={open} setOpen={setOpen}>
        <SidebarBody className='justify-between gap-10'>
          <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
            <div className='flex items-center gap-4'>
              <Image
                src={workspace.logoUrl + '-/preview/-/border_radius/50p/'}
                width={28}
                height={28}
                alt='workspace logo'
                priority
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='font-medium text-black dark:text-white whitespace-pre'
              >
                {workspace.name}
              </motion.span>
            </div>

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

export default Sidebar;

'use client';

import React, { FC, ReactNode, useState } from 'react';
import {
  Sidebar as SidebarWrapper,
  SidebarBody,
  SidebarLink,
} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';
import { useClerk, UserButton } from '@clerk/nextjs';
import { getSidebarItems, iconProps } from '@/constants/sidebar';
import { ChevronDownIcon, LogOutIcon, PlusIcon } from 'lucide-react';
import { WorkspaceWithUser } from '@/helpers/types';
import WorkspaceLogoBtn from '../workspace/WorkspaceLogoBtn';
import { useRouter } from 'next/navigation';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { useMedia } from '../providers/MediaProvider';

type Props = {
  userId: string;
  workspaces?: WorkspaceWithUser[];
  workspace: WorkspaceWithUser;
  onWorkspaceChange: (workspaceId: string) => void;
  children: ReactNode;
};

const Sidebar: FC<Props> = ({
  userId,
  workspaces,
  workspace,
  onWorkspaceChange,
  children,
}) => {
  const { user, openUserProfile, signOut } = useClerk();
  const { isNative } = useMedia();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  console.log(workspace);

  const sidebarItems = getSidebarItems();
  const otherWorkspaces = workspaces?.filter(w => w.id !== workspace.id);

  const onSignOut = async () => {
    await signOut({
      redirectUrl: '/',
    });
  };

  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-background flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'w-full h-full',
      )}
    >
      {/* TODO: Fix mobile open state */}
      <SidebarWrapper open={isNative ? open : true} setOpen={setOpen}>
        <SidebarBody className='justify-between gap-10'>
          <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <WorkspaceLogoBtn
                  logoUrl={workspace.logoUrl}
                  name={workspace.name}
                >
                  <ChevronDownIcon className='-ml-2' size={20} />
                </WorkspaceLogoBtn>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[250px] bg-primary-dark'>
                {otherWorkspaces?.map(workspace => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => onWorkspaceChange(workspace.id)}
                  >
                    <WorkspaceLogoBtn
                      logoUrl={workspace.logoUrl}
                      name={workspace.name}
                    />
                  </DropdownMenuItem>
                ))}
                {!!otherWorkspaces?.length && <DropdownMenuSeparator />}
                <DropdownMenuLabel className='p-1'>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push('/create-workspace')}
                >
                  <PlusIcon size={18} className='mr-2' />
                  Create workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='mt-8 flex flex-col gap-16'>
              {sidebarItems.map(item => (
                <div key={item.id}>
                  <div
                    className={cn(
                      'text-foreground font-semibold text-xs mb-2 whitespace-pre',
                      // !open && 'opacity-0',
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

'use client';

import React, { useEffect, useState } from 'react';
import CoverPicker from '@/components/create-workspace/CoverPicker';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { defaultWorkspaceLogoUrl, workspaceCovers } from '@/constants/covers';
import { initUser } from '@/lib/queries';
import { useUser } from '@clerk/nextjs';
import { Plan } from '@prisma/client';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/global/ImageUploader';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCreateWorkspace } from '@/helpers/workspace/query-helpers';

const CreateWorkspace = () => {
  const [coverImage, setCoverImage] = useState(workspaceCovers[0].imageUrl);
  const [workspaceName, setWorkspaceName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const { createWorkspace, isCreatingWorkspace } = useCreateWorkspace({
    onSuccess: () => router.replace('/dashboard'),
  });

  useEffect(() => {
    const createUser = async () => {
      await initUser({ plan: Plan.FREE });
    };

    if (user) {
      createUser();
    }
  }, [user?.id]);

  const onCreateWorkspace = () => {
    if (!workspaceName) return;

    const workspaceData = {
      name: workspaceName,
      coverUrl: coverImage,
      logoUrl: logoUrl ?? defaultWorkspaceLogoUrl,
    };

    createWorkspace(workspaceData);
  };
  return (
    <div className='p-10 md:px-36 lg:px-64 xl:px-96 py-28'>
      <div className='shadow-2xl rounded-xl'>
        {/* Cover Image  */}

        <CoverPicker onSelectCover={v => setCoverImage(v)}>
          <div className='relative group cursor-pointer'>
            <h2
              className='hidden absolute p-4 w-full h-full
                    items-center group-hover:flex
                    justify-center'
            >
              Change Cover
            </h2>
            <div className='group-hover:opacity-40 transition-all duration-300'>
              <Image
                src={coverImage}
                alt='cover'
                width={400}
                height={400}
                draggable={false}
                className='w-full h-[180px] object-cover rounded-t-xl'
              />
            </div>
          </div>
        </CoverPicker>

        {/* Input Section  */}
        <div className='p-12'>
          <h2 className='font-medium text-xl'>Create a new workspace</h2>
          <h2 className='text-sm mt-2'>
            This is a shared space where you can collaborate wth your team. You
            can always rename it later.
          </h2>
          <div className='mt-8 flex gap-2 items-center'>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'relative',
                    )}
                  >
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt='logo'
                        width={20}
                        height={20}
                        draggable={false}
                        className='object-cover'
                      />
                    ) : (
                      <ImagePlus />
                    )}
                    <ImageUploader
                      onUpload={setLogoUrl}
                      onRemove={() => setLogoUrl(null)}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='bottom' hideWhenDetached>
                  <div>Add logo</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Input
              placeholder='Workspace Name'
              onChange={e => setWorkspaceName(e.target.value)}
            />
          </div>
          <div className='mt-7 flex justify-end gap-6'>
            <Button
              isLoading={isCreatingWorkspace}
              disabled={!workspaceName?.length}
              onClick={onCreateWorkspace}
            >
              Create
            </Button>
            {/* <Button variant='outline'>Cancel</Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;

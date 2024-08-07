'use client';

import CoverPicker from '@/components/create-workspace/CoverPicker';
import EmojiPicker from '@/components/create-workspace/EmojiPicker';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { Loader2Icon, SmilePlus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function CreateWorkspace() {
  const [coverImage, setCoverImage] = useState('/assets/cover.png');
  const [workspaceName, setWorkspaceName] = useState('');
  const [emoji, setEmoji] = useState<string | null>(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onCreateWorkspace = async () => {
    // setLoading(true);
    // setLoading(false);
    router.replace('/dashboard');
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
            <EmojiPicker onSelectEmoji={v => setEmoji(v)}>
              <div className={buttonVariants({ variant: 'outline' })}>
                {emoji ?? <SmilePlus />}
              </div>
            </EmojiPicker>
            <Input
              placeholder='Workspace Name'
              onChange={e => setWorkspaceName(e.target.value)}
            />
          </div>
          <div className='mt-7 flex justify-end gap-6'>
            <Button
              disabled={!workspaceName?.length || loading}
              onClick={onCreateWorkspace}
            >
              Create {loading && <Loader2Icon className='animate-spin ml-2' />}{' '}
            </Button>
            {/* <Button variant='outline'>Cancel</Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspace;

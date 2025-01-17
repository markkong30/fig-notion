'use client';
import { createRef, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { workspaceCovers } from '@/constants/covers';
import { cn } from '@/lib/utils';
import { onEnterOrSpace } from '@/lib/helpers';
import { useKeyBoardNav } from '@/hooks/useKeyboardNav';

type Props = {
  onSelectCover: (cover: string) => void;
  children: ReactNode;
};

const CoverPicker: FC<Props> = ({ children, onSelectCover }) => {
  const [selectedCover, setSelectedCover] = useState('');
  const refs = useMemo(
    () => workspaceCovers.map(() => createRef<HTMLLIElement>()),
    [],
  );

  const { isKeyboardActivated, focusIndex, handleKeyboard } = useKeyBoardNav();

  useEffect(() => {
    refs[focusIndex]?.current?.focus();
  }, [focusIndex]);

  return (
    <Dialog>
      <DialogTrigger className='w-full'>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Cover</DialogTitle>
          <DialogDescription>
            <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3'>
              {workspaceCovers.map((cover, index) => (
                <li
                  key={`cover-${index}}`}
                  ref={refs[index]}
                  tabIndex={selectedCover === cover?.imageUrl ? 0 : -1}
                  onClick={() => setSelectedCover(cover.imageUrl)}
                  onKeyDown={e => {
                    handleKeyboard(e, refs, index);

                    onEnterOrSpace(e, () => setSelectedCover(cover.imageUrl));
                  }}
                  className={cn(
                    'p-1 rounded-md border-2',
                    isKeyboardActivated && 'focus-outline',
                    selectedCover === cover?.imageUrl
                      ? 'border-primary'
                      : 'border-transparent',
                  )}
                >
                  <Image
                    src={cover?.imageUrl}
                    priority
                    alt=''
                    width={200}
                    height={140}
                    draggable={false}
                    className='h-[70px] w-full rounded-md object-cover'
                  />
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className=''>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type='button' onClick={() => onSelectCover(selectedCover)}>
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoverPicker;

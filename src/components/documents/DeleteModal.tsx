'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type Props = {
  onDeleteDocument: () => void;
  isLoading?: boolean;
};

const DeleteModal = ({ onDeleteDocument, isLoading }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost'>
          <Trash2 size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className='p-8 pt-12'>
        <DialogHeader>
          <DialogTitle>Delete document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='mt-5'>
          <DialogClose asChild className='w-full bg-dark-400 text-white'>
            Cancel
          </DialogClose>

          <Button
            variant='destructive'
            onClick={onDeleteDocument}
            isLoading={isLoading}
            className='w-full'
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;

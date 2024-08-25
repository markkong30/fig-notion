'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

type Props = {
  title: string;
  subheading: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const CustomModal = ({
  children,
  isOpen,
  subheading,
  title,
  onClose,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-y-auto md:max-h-[700px] bg-card w-full lg:w-[600px] max-w-full'>
        <DialogHeader className='pt-8 text-left'>
          <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;

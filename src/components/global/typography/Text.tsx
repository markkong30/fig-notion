import React, { FC } from 'react';

import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      xs: 'text-xs',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    type: {
      default: 'font-normal',
      bold: 'font-bold',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    margin: {
      default: 'mb-0',
      xs: 'mb-1',
      sm: 'mb-2',
      md: 'mb-4',
      lg: 'mb-6',
      xl: 'mb-8',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
    margin: 'default',
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof textVariants> {
  text?: string;
}

const Text: FC<TextProps> = ({
  text,
  children,
  className,
  size,
  margin,
  type,
  variant,
  ...props
}) => {
  return (
    <div
      className={cn(textVariants({ size, type, variant, margin, className }))}
      {...props}
    >
      {text}
      {children}
    </div>
  );
};

export default Text;

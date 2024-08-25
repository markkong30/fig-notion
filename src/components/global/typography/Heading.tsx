import React, { FC } from 'react';

import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
    },
    size: {
      default: 'text-2xl lg:text-3xl',
      sm: 'text-base font-semibold',
      base: 'text-xl',
      md: 'text-3xl lg:text-4xl',
      lg: 'text-4xl lg:text-5xl',
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

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  text?: string;
}

const Heading: FC<HeadingProps> = ({
  text,
  children,
  className,
  size,
  margin,
  variant,
  ...props
}) => {
  return (
    <h1
      className={cn(headingVariants({ size, variant, margin, className }))}
      {...props}
    >
      {text}
      {children}
    </h1>
  );
};

export default Heading;

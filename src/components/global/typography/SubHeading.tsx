import React, { FC } from 'react';

import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const subheadingVariants = cva('', {
  variants: {
    variant: {
      default: 'text-black',
      gray: 'text-gray-700',
    },
    size: {
      default: 'text-lg lg:text-xl',
      sm: 'text-sm font-semibold',
      md: 'text-xl lg:text-2xl',
      lg: 'text-2xl lg:text-3xl',
    },
    margin: {
      default: 'mb-0',
      sm: 'mb-1',
      md: 'mb-2',
      lg: 'mb-3',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
    margin: 'default',
  },
});

interface SubheadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof subheadingVariants> {
  text?: string;
}

const Subheading: FC<SubheadingProps> = ({
  text,
  children,
  className,
  size,
  margin,
  variant,
  ...props
}) => {
  return (
    <h3
      className={cn(subheadingVariants({ size, variant, margin, className }))}
      {...props}
    >
      {text}
      {children}
    </h3>
  );
};

export default Subheading;

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const captionVariants = cva('max-w-prose', {
  variants: {
    variant: {
      default: 'text-gray-500',
      black: 'text-black',
    },
    size: {
      default: 'text-xs',
      xs: 'text-3xs',
      sm: 'text-2xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    margin: {
      default: 'mb-0',
      sm: 'mb-1',
      md: 'mb-2',
      lg: 'mb-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    margin: 'default',
  },
});

interface CaptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof captionVariants> {
  text?: string;
}

const Caption = React.forwardRef<HTMLParagraphElement, CaptionProps>(
  ({ text, className, size, variant, margin, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(captionVariants({ size, variant, margin, className }))}
        {...props}
      >
        {text}
        {children}
      </p>
    );
  },
);

Caption.displayName = 'Caption';

export default Caption;

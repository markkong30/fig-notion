import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const paragraphVariants = cva('max-w-prose', {
  variants: {
    variant: {
      default: 'text-slate-700',
      black: 'text-black',
    },
    size: {
      default: 'text-base xl:text-lg',
      sm: 'text-sm',
      xs: 'text-xs',
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

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {
  text?: string;
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ text, className, size, variant, margin, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(paragraphVariants({ size, variant, margin, className }))}
        {...props}
      >
        {text}
        {children}
      </p>
    );
  },
);

Paragraph.displayName = 'Paragraph';

export default Paragraph;

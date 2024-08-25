import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { FC } from 'react';

type Props = {
  size?: number;
  color?: string;
  withMask?: boolean;
  fullScreen?: boolean;
};

const Spinner: FC<Props> = ({ size, color, withMask, fullScreen }) => {
  return (
    <div
      className={cn(
        fullScreen ? 'w-screen h-screen relative' : 'absolute inset-0',
        withMask && 'backdrop-blur-[2px] z-[999]',
      )}
    >
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <Loader2Icon
          className='animate-spin text-foreground z-50'
          size={size ?? 30}
          color={color}
        />
      </div>
    </div>
  );
};

export default Spinner;

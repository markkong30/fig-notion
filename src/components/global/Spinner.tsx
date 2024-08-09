import { Loader2Icon } from 'lucide-react';
import { FC } from 'react';

type Props = {
  size?: number;
  color?: string;
};

const Spinner: FC<Props> = ({ size, color }) => {
  return (
    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <Loader2Icon
        className='animate-spin text-foreground'
        size={size ?? 30}
        color={color}
      />
    </div>
  );
};

export default Spinner;

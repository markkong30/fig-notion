import Image from 'next/image';
import { FC, ReactNode } from 'react';
import Text from '../global/typography/Text';

type Props = {
  logoUrl: string;
  name: string;
  children?: ReactNode;
};

const WorkspaceItem: FC<Props> = ({ logoUrl, name, children }) => {
  return (
    <div className='flex items-center gap-4'>
      <Image
        src={logoUrl + '-/preview/-/border_radius/50p/'}
        width={40}
        height={40}
        alt='workspace logo'
        priority
      />
      <Text size='lg' type='medium'>
        {name}
      </Text>
      {children}
    </div>
  );
};

export default WorkspaceItem;

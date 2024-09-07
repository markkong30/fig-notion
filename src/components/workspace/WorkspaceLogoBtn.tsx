import Image from 'next/image';
import { FC, ReactNode } from 'react';
import Text from '../global/typography/Text';
import { useRouter } from 'next/navigation';

type Props = {
  logoUrl: string;
  name: string;
  isButton?: boolean;
  children?: ReactNode;
};

const WorkspaceLogoBtn: FC<Props> = ({ logoUrl, name, isButton, children }) => {
  const router = useRouter();
  const Component = isButton ? 'button' : 'div';

  return (
    <Component
      className='flex items-center gap-4'
      onClick={isButton ? () => router.push('/dashboard') : undefined}
    >
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
    </Component>
  );
};

export default WorkspaceLogoBtn;

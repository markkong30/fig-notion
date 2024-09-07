import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import Icons from './icons';

type Props = {
  size?: number;
};

const LogoBtn: FC<Props> = ({ size }) => {
  return (
    <Link href='/' className='flex items-center gap-2'>
      <Image src='/assets/logo.png' alt='FigNotion' width={50} height={50} />
      <Icons.logo className='w-auto h-6' />
    </Link>
  );
};

export default LogoBtn;

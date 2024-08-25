'use client';

import { useEffect } from 'react';
import Spinner from '@/components/global/Spinner';
import { initUser } from '@/lib/queries';
import { Plan } from '@prisma/client';
import { useUser } from '@clerk/nextjs';

const Redirect = () => {
  const { user } = useUser();

  useEffect(() => {
    const initLoginRedirect = async () => {
      await initUser({ plan: Plan.FREE });
      await user?.reload();
    };

    if (user) {
      initLoginRedirect();
    }
  }, [user?.id]);

  return (
    <div className='w-screen h-screen'>
      <Spinner size={50} fullScreen />
    </div>
  );
};

export default Redirect;

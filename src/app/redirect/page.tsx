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
    };

    if (user) {
      initLoginRedirect();
    }
  }, [user?.id]);

  return <Spinner size={50} />;
};

export default Redirect;

import Sidebar from '@/components/dashboard/Sidebar';
import { FC } from 'react';

type Props = {
  params: {
    id: string;
  };
};

const Dashboard: FC<Props> = ({ params }) => {
  const dashboardId = params.id;

  return (
    <div className='w-screen h-screen'>
      <Sidebar>{dashboardId}</Sidebar>
    </div>
  );
};

export default Dashboard;

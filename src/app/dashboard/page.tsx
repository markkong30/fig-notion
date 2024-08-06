import Sidebar from '@/components/dashboard/Sidebar';
import { currentUser } from '@clerk/nextjs/server';

const Dashboard = async () => {
  const user = await currentUser();

  return (
    <div className='w-screen h-screen'>
      <Sidebar userName={user?.fullName ?? ''} />
    </div>
  );
};

export default Dashboard;

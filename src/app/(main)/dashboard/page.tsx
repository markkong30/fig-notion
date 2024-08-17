import { FC } from 'react';

const Dashboard: FC = () => {
  return (
    <div className='w-screen h-screen relative'>
      <div className='hidden md:block absolute bottom-0 -right-1/4 w-72 h-72 bg-indigo-600 rounded-full blur-[10rem]'></div>
      <div className='hidden md:block absolute top-0 -right-1/4 w-72 h-72 bg-primary rounded-full blur-[10rem]'></div>
      dashboard
    </div>
  );
};

export default Dashboard;

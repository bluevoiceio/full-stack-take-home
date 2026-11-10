import { Outlet } from 'react-router-dom';

import { Drawer } from '@/components/shared';

export const DashboardLayout = () => (
  <div className='flex h-dvh flex-row overflow-hidden'>
    <Drawer />
    <div className='flex-1 overflow-y-auto px-6 py-6'>
      <div className='mx-auto max-w-6xl'>
        <Outlet />
      </div>
    </div>
  </div>
);

import { Outlet } from 'react-router-dom';

import { Drawer } from '@/components/shared';

export const DashboardLayout = () => (
  <div className='flex h-dvh flex-row overflow-hidden'>
    <Drawer />
    <div className='z-30 flex flex-1 flex-col overflow-hidden'>
      <div className='size-full overflow-y-auto px-6 py-4'>
        <Outlet />
      </div>
    </div>
  </div>
);

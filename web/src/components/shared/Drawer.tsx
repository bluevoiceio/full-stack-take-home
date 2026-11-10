import { LogOut, Menu, Shield } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useGetDepartment } from '@/hooks/admin-api';
import { useActiveUser } from '@/hooks/useActiveUser';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import { fullName } from '@/utils/format-utils';

import { Button } from './Button';
import { ADMIN_NAV_ITEMS } from './navigation';

export const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useActiveUser();
  const { department } = useGetDepartment();
  const signOut = useAuthStore(state => state.signOut);

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r bg-muted/40 transition-[width]',
        isOpen ? 'w-56' : 'w-14',
      )}
    >
      <div className='flex h-14 items-center gap-2 px-2.5'>
        <Button
          variant='ghost'
          size='icon'
          aria-label='Toggle navigation'
          onClick={() => setIsOpen(previous => !previous)}
        >
          <Menu className='size-4' />
        </Button>
        {isOpen && (
          <span className='flex items-center gap-1.5 font-semibold text-primary'>
            <Shield className='size-4' />
            Admin
          </span>
        )}
      </div>

      <nav className='flex flex-1 flex-col gap-1 border-t px-2.5 py-3'>
        {ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/dashboard'}
            title={label}
            className={({ isActive }) =>
              cn(
                'flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Icon className='size-4 shrink-0' />
            {isOpen && label}
          </NavLink>
        ))}
      </nav>

      <div className='flex items-center gap-2 border-t px-2.5 py-3'>
        {isOpen && user && (
          <div className='min-w-0 flex-1 px-1'>
            <p className='truncate text-sm font-medium'>{fullName(user)}</p>
            <p className='truncate text-xs text-muted-foreground'>
              {department?.name ?? user.title}
            </p>
          </div>
        )}
        <Button
          variant='ghost'
          size='icon'
          aria-label='Sign out'
          title='Sign out'
          onClick={signOut}
        >
          <LogOut className='size-4' />
        </Button>
      </div>
    </aside>
  );
};

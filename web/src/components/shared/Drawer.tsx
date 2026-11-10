import { LogOut, type LucideIcon, Menu } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

import { Button } from './Button';
import { Logo } from './Logo';
import { ADMIN_NAV_ITEMS } from './navigation';

const ITEM =
  'flex w-full items-center rounded-md py-2 text-sm transition-colors duration-150';

const ItemContent = ({
  icon: Icon,
  label,
  isExpanded,
}: {
  icon: LucideIcon;
  label: string;
  isExpanded: boolean;
}) => (
  <span className='flex items-center gap-2'>
    <Icon
      className={cn('size-4 shrink-0', isExpanded && 'mr-3')}
      aria-hidden='true'
    />
    {isExpanded && <span className='truncate'>{label}</span>}
  </span>
);

export const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const signOut = useAuthStore(state => state.signOut);
  const spacing = isOpen ? 'px-3' : 'justify-center px-2';

  return (
    <aside
      className={cn(
        'z-40 flex h-full shrink-0 flex-col border-r bg-muted/5 motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-in-out',
        isOpen ? 'w-56' : 'w-14',
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-2 border-b px-2 py-3',
          isOpen ? 'justify-start' : 'justify-center',
        )}
      >
        <Button
          variant='ghost'
          size='icon'
          aria-label={isOpen ? 'Collapse navigation' : 'Expand navigation'}
          onClick={() => setIsOpen(previous => !previous)}
        >
          <Menu className='size-5' aria-hidden='true' />
        </Button>
        {isOpen && <Logo variant='inlineWithText' />}
      </div>

      <nav className='flex-1 overflow-y-auto px-2 py-6'>
        <ul className={cn('space-y-1', isOpen ? 'p-2' : 'px-1 py-2')}>
          {ADMIN_NAV_ITEMS.map(({ label, href, icon }) => (
            <li key={href}>
              <NavLink
                to={href}
                end={href === '/dashboard'}
                aria-label={isOpen ? undefined : label}
                title={isOpen ? undefined : label}
                className={({ isActive }) =>
                  cn(
                    ITEM,
                    spacing,
                    isActive
                      ? 'bg-primary font-semibold text-white shadow-xs'
                      : 'font-medium text-primary hover:bg-primary/20',
                  )
                }
              >
                <ItemContent icon={icon} label={label} isExpanded={isOpen} />
              </NavLink>
            </li>
          ))}
        </ul>

        <hr className='my-4' />

        <ul className={cn('space-y-1', isOpen ? 'p-2' : 'px-1 py-2')}>
          <li>
            <button
              type='button'
              aria-label={isOpen ? undefined : 'Log Out'}
              title={isOpen ? undefined : 'Log Out'}
              onClick={signOut}
              className={cn(
                ITEM,
                spacing,
                'bg-destructive font-medium text-white hover:bg-destructive/90',
              )}
            >
              <ItemContent icon={LogOut} label='Log Out' isExpanded={isOpen} />
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

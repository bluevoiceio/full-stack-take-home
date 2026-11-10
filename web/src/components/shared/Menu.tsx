import { ChevronDown, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import { Popover } from './Popover';

export interface MenuItemProps {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  /** Extra classes for the icon, e.g. `text-destructive`. */
  iconStyle?: string;
}

interface MenuProps {
  buttonLabel: ReactNode;
  items: MenuItemProps[];
  menuButtonStyle?: string;
  iconStyle?: string;
}

export const Menu = ({
  buttonLabel,
  items,
  menuButtonStyle,
  iconStyle,
}: MenuProps) => (
  <Popover
    align='end'
    className='min-w-[180px] p-1'
    triggerClassName={cn(
      'group flex h-auto items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden',
      menuButtonStyle,
    )}
    trigger={
      <>
        {buttonLabel}
        <ChevronDown
          className={cn(
            'size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180',
            iconStyle,
          )}
          aria-hidden='true'
        />
      </>
    }
  >
    {close => (
      <div role='menu'>
        {items.map(
          ({ label, onClick, icon: Icon, iconStyle: itemIconStyle }) => (
            <button
              key={label}
              type='button'
              role='menuitem'
              onClick={() => {
                close();
                onClick();
              }}
              className='flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground'
            >
              {Icon && (
                <Icon
                  className={cn('mr-2 size-4', itemIconStyle)}
                  aria-hidden='true'
                />
              )}
              {label}
            </button>
          ),
        )}
      </div>
    )}
  </Popover>
);

/** The "Actions" button that leads every table row. */
export const ActionsMenu = ({ items }: { items: MenuItemProps[] }) => (
  <div className='flex size-full items-center'>
    <Menu
      buttonLabel={<span>Actions</span>}
      menuButtonStyle='h-8 bg-primary text-primary-foreground hover:bg-primary/90'
      iconStyle='text-primary-foreground'
      items={items}
    />
  </div>
);

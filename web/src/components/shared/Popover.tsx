import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';

const PANEL_ROOM = 280;

interface PopoverProps {
  /** The button's contents. The button itself is rendered here. */
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
  align?: 'start' | 'end';
  className?: string;
  /** Receives `close`, so an item can dismiss the panel after acting. */
  children: (close: () => void) => ReactNode;
}

// A floating panel anchored to its button. It renders into the body, so a
// scrolling or clipped parent (a table card, a modal) cannot cut it off.
export const Popover = ({
  trigger,
  triggerClassName,
  triggerLabel,
  align = 'start',
  className,
  children,
}: PopoverProps) => {
  const [position, setPosition] = useState<CSSProperties | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = position !== null;
  const close = () => setPosition(null);

  const open = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Below the button by default, above it when the button sits low in the window.
    const opensUp = window.innerHeight - rect.bottom < PANEL_ROOM;
    setPosition({
      ...(opensUp
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
      ...(align === 'end'
        ? { right: window.innerWidth - rect.right }
        : { left: rect.left }),
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setPosition(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPosition(null);
    };
    const onScroll = (event: Event) => {
      if (!panelRef.current?.contains(event.target as Node)) setPosition(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type='button'
        aria-haspopup='true'
        aria-expanded={isOpen}
        aria-label={triggerLabel}
        data-state={isOpen ? 'open' : 'closed'}
        className={triggerClassName}
        onClick={() => (isOpen ? close() : open())}
      >
        {trigger}
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            style={position}
            className={cn(
              'fixed z-50 rounded-md border bg-background text-foreground shadow-md',
              className,
            )}
          >
            {children(close)}
          </div>,
          document.body,
        )}
    </>
  );
};

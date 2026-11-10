import { X } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: ReactNode;
  confirmButtonLabel: string;
  variant?: 'primary' | 'error';
  isConfirmLoading?: boolean;
  isConfirmDisabled?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmButtonLabel,
  variant = 'primary',
  isConfirmLoading = false,
  isConfirmDisabled = false,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
      onMouseDown={onClose}
    >
      <form
        role='dialog'
        aria-modal='true'
        aria-label={title}
        className='flex max-h-[85vh] w-full max-w-lg flex-col rounded-lg border bg-background shadow-lg'
        onMouseDown={event => event.stopPropagation()}
        onSubmit={event => {
          event.preventDefault();
          onConfirm();
        }}
      >
        <div className='flex items-center justify-between border-b px-6 py-4'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <Button
            variant='ghost'
            size='icon'
            aria-label='Close'
            onClick={onClose}
          >
            <X className='size-4' />
          </Button>
        </div>
        <div className='flex-1 overflow-auto px-6 py-4'>{body}</div>
        <div className='flex justify-end gap-2 border-t px-6 py-4'>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant={variant}
            isLoading={isConfirmLoading}
            disabled={isConfirmDisabled}
          >
            {confirmButtonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

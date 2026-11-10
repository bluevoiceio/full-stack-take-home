import { type InputHTMLAttributes, useId } from 'react';

import { cn } from '@/utils/cn';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = ({
  label,
  error,
  className,
  ...props
}: FormInputProps) => {
  const id = useId();
  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor={id} className='text-sm font-medium'>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        className={cn(
          'h-9 rounded-md border bg-card px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          error && 'border-destructive',
          className,
        )}
        {...props}
      />
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
};

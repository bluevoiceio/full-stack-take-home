import { type InputHTMLAttributes, useId } from 'react';

import { cn } from '@/utils/cn';

import { inputErrorStyles, inputStyles } from './styles';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  caption?: string;
}

export const FormInput = ({
  label,
  error,
  caption,
  className,
  ...props
}: FormInputProps) => {
  const id = useId();
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='text-sm leading-none font-medium'>
        {label}
        {props.required && <span className='ml-0.5 text-destructive'>*</span>}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        className={cn(inputStyles, error && inputErrorStyles, className)}
        {...props}
      />
      {error ? (
        <p className='text-xs text-destructive'>{error}</p>
      ) : (
        caption && <p className='text-xs text-muted-foreground'>{caption}</p>
      )}
    </div>
  );
};

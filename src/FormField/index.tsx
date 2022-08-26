import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface FormFieldProps {
  label?: string;
  sublabel?: string;
  required?: boolean;
  caption?: string;
  // children?: React.ReactNode | ((register: any) => any);
  children?: React.ReactNode;
  status?: 'default' | 'warning' | 'error';
}
const FormField = (props: FormFieldProps) => {
  const { label, sublabel, required, caption, children, status } = props;

  return (
    <div className='flex'>
      <div>
        <div className='whitespace-prewrap break-words w-32 mr-4 text-lg leading-6 pt-2 pb-1'>
          {label}
          {required && (
            <span className='relative align-text-top'>
              <div className='absolute inline w-1.5 h-1.5 bg-secondary rounded-full ml-1' />
            </span>
          )}
        </div>
        <div className='text-xs text-grey-500'>{sublabel}</div>
      </div>
      <div className='flex-1'>
        <div className='w-full'>
          {React.isValidElement(children)
            ? React.cloneElement(children, { status })
            : children}
        </div>
        <div
          className={twMerge(
            'text-xs leading-[.875rem] text-grey-500',
            status === 'warning' && 'text-warning',
            status === 'error' && 'text-error'
          )}
        >
          {caption}
        </div>
      </div>
    </div>
  );
};
FormField.defaultProps = {
  status: 'default',
};

export default FormField;

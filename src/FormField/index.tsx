import React from 'react';
import { twMerge } from 'tailwind-merge';

interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
  sublabel?: string;
}

const FieldLabel = (props: FieldLabelProps) => {
  const { children, required, sublabel } = props;

  return (
    <div>
      <div className='whitespace-prewrap break-words w-32 mr-4 text-lg leading-6 pt-2 pb-1 capitalize'>
        {children}
        {required && (
          <span className='relative'>
            <div className='absolute inline w-1.5 h-1.5 bg-secondary rounded-full ml-1' />
          </span>
        )}
      </div>
      <div className='text-xs text-grey-500'>{sublabel}</div>
    </div>
  );
};

const InputContainer = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className='flex-1 [&>*]:w-full' {...props} />
);

interface StatusCaptionProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'default' | 'warning' | 'error';
}
const StatusCaption = ({
  status,
  children,
  className,
  ...rest
}: StatusCaptionProps) => (
  <div
    className={twMerge(
      'text-xs leading-[.875rem] text-grey-500',
      status === 'warning' && 'text-warning',
      status === 'error' && 'text-error',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

const FormField = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className='sm:flex' {...props} />
);

FormField.Label = FieldLabel;
FormField.Container = InputContainer;
FormField.Caption = StatusCaption;

export default FormField;

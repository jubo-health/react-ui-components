import React from 'react';
import { twMerge } from 'tailwind-merge';
import CheckIcon from '../icons/CheckIcon';

export interface FormButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
}

const defaultProps = { size: 'lg', name: 'test' } as FormButtonProps;

const FormButton = React.forwardRef<
  HTMLInputElement,
  FormButtonProps & typeof defaultProps
>((props, ref) => {
  const { name, size, children, className, ...rest } = props;
  return (
    <div className='relative'>
      <input
        type='checkbox'
        id={name}
        name={name}
        value='Bike'
        className='peer hidden'
        {...rest}
      />
      <CheckIcon className='fill-primary invisible peer-checked:visible absolute m-2' />
      <label
        htmlFor={name}
        className={twMerge(
          'flex select-none w-1/2 rounded-sm border border-grey-700 text-grey-700',
          'text-lg leading-6 p-1',
          'peer-checked:border-primary peer-checked:text-primary',
          className
        )}
      >
        <CheckIcon className='invisible m-1' />
        <div className='m-1'>{children}</div>
      </label>
    </div>
  );
});
FormButton.defaultProps = defaultProps;

export default FormButton;

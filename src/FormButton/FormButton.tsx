import React from 'react';
import { twMerge } from 'tailwind-merge';
import uniqueId from 'lodash/uniqueId';

import CheckIcon from '../icons/CheckIcon';

export interface FormButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  name: string;
  value: string;
  selected?: boolean;
  color?: 'primary' | 'secondary';
}

const defaultProps = { size: 'lg' } as FormButtonProps;

const FormButton = React.forwardRef<
  HTMLInputElement,
  FormButtonProps & typeof defaultProps
>((props, ref) => {
  const { name, size, children, className, value, color, ...rest } = props;
  const id = React.useMemo(() => uniqueId('form-button-'), []);
  return (
    <div className='relative'>
      <input
        id={id}
        value={value}
        name={name}
        className='peer hidden'
        ref={ref}
        type='radio'
        {...rest}
      />
      <CheckIcon className='fill-primary invisible pointer-events-none peer-checked:visible absolute m-2' />
      <div
        className={twMerge(
          'absolute pointer-events-none border rounded-sm border-grey-700 peer-checked:border-primary w-full h-full',
          color === 'secondary' && 'border-grey-400'
        )}
      />
      <label
        htmlFor={id}
        className={twMerge(
          'flex select-none rounded-sm w-full h-full',
          'text-lg leading-6 p-1',
          'text-grey-700 peer-checked:text-primary',
          color === 'secondary' && 'text-grey-400',
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

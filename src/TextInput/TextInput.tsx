import React from 'react';
import { twMerge } from 'tailwind-merge';

import InputHolder from '../InputHolder';

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  /**
   * 前（左）方裝飾物
   */
  startAdornment?: React.ReactNode;
  /**
   * 後（右）方裝飾物
   */
  endAdornment?: React.ReactNode;
  /**
   * 輸入狀態，僅影響底線顏色
   */
  status?: 'default' | 'warning' | 'error';
  /**
   * input原生的屬性: size，以字元長度定義的寬度，但現版面多直接給定 rem-base or pixel-base 的寬度所以也不大建議使用
   */
  widthInCharLength?: number;
  value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
  onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      size,
      status,
      widthInCharLength,
      className,
      startAdornment,
      endAdornment,
      onKeyDown,
      onCompositionStart,
      onCompositionEnd,
      value,
      onChange,
      ...rest
    } = props;
    const isComposing = React.useRef(false);
    return (
      <InputHolder
        status={status}
        size={size}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        className={className}
      >
        <input
          ref={ref}
          className='outline-none bg-transparent flex-1 w-full'
          tabIndex={0}
          size={widthInCharLength}
          value={value}
          onChange={onChange}
          onCompositionStart={e => {
            isComposing.current = true;
            if (onCompositionStart) onCompositionStart(e);
          }}
          onCompositionEnd={e => {
            isComposing.current = false;
            if (onCompositionEnd) onCompositionEnd(e);
          }}
          onKeyDown={e => {
            if (!isComposing.current && onKeyDown) onKeyDown(e);
          }}
          {...rest}
        />
      </InputHolder>
    );
  }
);

type DefaultProps = {
  size: 'lg';
  status: 'default';
};
TextInput.defaultProps = { size: 'lg', status: 'default' } as DefaultProps;
const TextInputAssigned = Object.assign(TextInput, {
  registrable: true,
});

export default TextInputAssigned;

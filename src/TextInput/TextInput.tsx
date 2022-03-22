/* eslint-disable react/require-default-props */
import React from 'react';
import clsx from 'clsx';

export interface TextInputProps extends React.HTMLAttributes<HTMLInputElement> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   */
  size?: 'sm' | 'lg';
  /**
   * 無內容時底部的文字
   */
  placeholder?: string;
  /**
   * 前（左）方裝飾物
   */
  startAdornment?: React.ReactNode;
  /**
   * 後（右）方裝飾物
   */
  endAdornment?: React.ReactNode;
  /**
   * 是否允許多行輸入
   */
  multiline?: boolean;
  /**
   * 輸入狀態，僅影響底線顏色
   */
  status?: 'default' | 'warning' | 'error';
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const { size, status, ...rest } = props;
    return (
      <div
        className={clsx(
          'inline-flex relative after:border-b after:border-b-grey-400 after:absolute after:bottom-0 after:inset-x-0 w-c',
          'hover:after:border-b-2',
          'focus-within:after:border-b-2',
          status === 'warning' && 'focus-within:after:border-b-warning',
          status === 'error'
            ? 'after:border-b-error after:border-b-2'
            : 'hover:after:border-b-grey-900',
          status === 'default' && 'focus-within:after:border-b-primary'
        )}
      >
        <input
          ref={ref}
          className={clsx(
            'outline-none bg-transparent',
            'leading-6',
            size === 'lg' ? 'text-lg h-10' : 'h-8'
          )}
          tabIndex={0}
          {...rest}
        />
      </div>
    );
  }
);

type DefaultProps = {
  size: 'lg';
  status: 'default';
};
TextInput.defaultProps = { size: 'lg', status: 'default' } as DefaultProps;

export default TextInput;

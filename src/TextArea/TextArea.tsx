import React from 'react';

import { twMerge } from 'tailwind-merge';
import InputHolder from '../InputHolder';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
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
   * 輸入狀態，僅影響底線顏色
   */
  status?: 'default' | 'warning' | 'error';
  /**
   * input原生的屬性: size，以字元長度定義的寬度，但現版面多直接給定 rem-base or pixel-base 的寬度所以也不大建議使用
   */
  widthInCharLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const { size, status, widthInCharLength, className, style, ...rest } =
      props;
    const [value, setValue] = React.useState('');
    return (
      <InputHolder
        className={twMerge(
          'before:whitespace-pre-wrap before:invisible before:line-clamp-5',
          // pb-4 for preserve scrollbar
          'before:content-[attr(data-value)] before:row-span-full before:col-span-full before:pr-4',
          'inline-grid h-auto pb-1.5',
          className,
          className &&
            className
              .split(' ')
              .map(s => `before:${s}`)
              .join(' ')
        )}
        style={style}
        status={status}
        size={size}
        data-value={`${value} `}
      >
        <textarea
          ref={ref}
          className={twMerge(
            'resize-none outline-none bg-transparent row-span-full col-span-full',
            className
          )}
          style={style}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          tabIndex={0}
          rows={1}
          onChange={e => {
            setValue(e.currentTarget.value);
            console.log(e.currentTarget.value);
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
Textarea.defaultProps = { size: 'lg', status: 'default' } as DefaultProps;

export default Textarea;

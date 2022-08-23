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
    const {
      size,
      status,
      widthInCharLength,
      className,
      style,
      children: propsValue,
      onChange,
      ...rest
    } = props;
    const skeleton = React.useRef<HTMLDivElement>(null);
    const { current: isControlled } = React.useRef(
      typeof propsValue !== 'undefined'
    );
    const [value, setValue] = React.useState('');

    // for the mismatch of scrollbar auto judgements
    // between skeleton and textarea
    const [showScrollbar, setShowScrollbar] = React.useState(false);
    const reviseScrollbar = React.useCallback(() => {
      if (skeleton.current) {
        const { lineHeight, height } = window.getComputedStyle(
          skeleton.current
        );
        const lines = +height.replace('px', '') / +lineHeight.replace('px', '');
        setShowScrollbar(lines >= 5);
      }
    }, []);

    React.useEffect(() => {
      reviseScrollbar();
    }, [reviseScrollbar]);

    const handleChange = React.useCallback(
      e => {
        setValue(e.currentTarget.value);
        reviseScrollbar();
        if (onChange) onChange(e);
      },
      [reviseScrollbar, onChange]
    );

    return (
      <InputHolder
        className='inline-grid h-auto'
        style={style}
        status={status}
        size={size}
        data-value={`${value} `}
      >
        <div
          className={twMerge(
            'whitespace-pre-wrap line-clamp-5 break-words invisible',
            'row-span-full col-span-full pb-1.5',
            className
          )}
          ref={skeleton}
        >
          {`${isControlled ? propsValue : value} `}
        </div>
        <textarea
          ref={ref}
          className={twMerge(
            'resize-none outline-none bg-transparent row-span-full col-span-full pb-1.5',
            showScrollbar ? 'overflow-y-auto' : 'overflow-hidden',
            className
          )}
          style={style}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          tabIndex={0}
          rows={1}
          onChange={handleChange}
          {...rest}
        >
          {isControlled ? propsValue : value}
        </textarea>
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

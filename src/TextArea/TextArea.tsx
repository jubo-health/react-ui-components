import React from 'react';
import clsx from 'clsx';

export interface TextAreaProps
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
   * 是否允許多行輸入
   */
  multiline?: boolean;
  /**
   * 輸入狀態，僅影響底線顏色
   */
  status?: 'default' | 'warning' | 'error';
  /**
   * input原生的屬性: size，以字元長度定義的寬度，但現版面多直接給定 rem-base or pixel-base 的寬度所以也不大建議使用
   */
  widthInCharLength?: number;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const { size, status, widthInCharLength, ...rest } = props;
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
          status === 'default' && 'focus-within:after:border-b-primary',
          'leading-6',
          size === 'lg' ? 'text-lg h-10' : 'h-8'
        )}
      >
        <textarea
          ref={ref}
          className={clsx('resize-none outline-none bg-transparent')}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
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
TextArea.defaultProps = { size: 'lg', status: 'default' } as DefaultProps;

export default TextArea;

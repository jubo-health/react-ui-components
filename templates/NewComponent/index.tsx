import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface NewComponentProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
}

const defaultProps = { size: 'lg' } as NewComponentProps;

const NewComponent = React.forwardRef<
  HTMLInputElement,
  NewComponentProps & typeof defaultProps
>((props, ref) => {
  const { size, ...rest } = props;
  return <input ref={ref} {...rest} />;
});
NewComponent.defaultProps = defaultProps;

export default NewComponent;

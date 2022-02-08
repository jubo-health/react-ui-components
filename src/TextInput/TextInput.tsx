import React from 'react';
import clsx from 'clsx';

export type TextInputProps = {
  color?: 'light' | 'dark';
  size?: 'm' | 'l';
  className?: string;
};

const TextInput = React.forwardRef<any, TextInputProps>((props, ref) => {
  const { color, size, children, className, ...rest } = props;
  return (
    <input
      className={clsx(
        'outline-none bg-transparent',
        'border-b',
        'focus:border-b-black'
      )}
      {...rest}
    >
      {children}
    </input>
  );
});

TextInput.defaultProps = {
  color: 'light',
  size: 'l',
};

export default TextInput;

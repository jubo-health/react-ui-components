import React from 'react';
import clsx from 'clsx';

export interface TextInputProps extends React.HTMLAttributes<HTMLInputElement> {
  size?: 's' | 'l';
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const { size, ...rest } = props;
    return (
      <div
        className={clsx(
          'inline-flex relative after:border-b after:border-b-grey-400 after:absolute after:bottom-0 after:inset-x-0 w-c',
          'hover:after:border-b-2 hover:after:border-b-grey-900',
          'focus-within:after:border-b-primary focus-within:after:border-b-2',
        )}
      >
        <input
          ref={ref}
          className={clsx(
            'outline-none bg-transparent',
            'text-lg h-10 leading-6',
          )}
          tabIndex={0}
          {...rest}
        />
      </div>
    );
  },
);

TextInput.defaultProps = { size: 'l' };

export default TextInput;

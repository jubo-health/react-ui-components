import React from 'react';
import clsx from 'clsx';

export type DividerProps = {
  color?: 'light' | 'dark';
  size?: 'm' | 'l';
  onClick?: () => void;
  children?: React.ReactNode;
  adornment?: React.ReactNode;
  style?: React.CSSProperties;
};

const Divider = (props: DividerProps) => {
  const { color, size, children, onClick, adornment, style } = props;
  return (
    <div
      className={clsx(
        'p-2 bg-gray-500 text-white flex items-center h-10 max-h-10 sticky left-0',
        size === 'l' && 'px-1 py-2 h-8',
        color === 'light' && 'bg-gray-200 text-gray-700'
      )}
      onClick={onClick}
      style={style}
    >
      {adornment ? (
        <React.Fragment>
          <div className="flex-1">{children}</div>
          <div className="flex items-center">{adornment}</div>
        </React.Fragment>
      ) : (
        children
      )}
    </div>
  );
};

Divider.defaultProps = {
  color: 'dark',
  size: 'l',
};

export default Divider;

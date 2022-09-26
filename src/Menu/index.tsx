import React from 'react';
import { twMerge } from 'tailwind-merge';

import { PropsOf, AsProps } from '../types';
import Popover from '../Popover';
import Item from '../Item';

interface MenuContextProps {
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
  onChange?: (value: string, index: number) => void;
}
const MenuContext = React.createContext<MenuContextProps>({
  onMouseMove: () => {},
  onChange: () => {},
});

const DEFAULT_BASE = Item;
type MenuItemProps<BaseElement> = AsProps<BaseElement> &
  PropsOf<BaseElement> & {
    value?: string | number;
  };

function MenuItem<BaseElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: MenuItemProps<BaseElement>
) {
  const {
    as,
    onMouseMove: propsOnMouseMove,
    index,
    className,
    onClick,
    value,
    ...rest
  } = props;
  const { onMouseMove, onChange } = React.useContext(MenuContext);

  return React.createElement(as || DEFAULT_BASE, {
    onMouseMove: e => {
      if (propsOnMouseMove) propsOnMouseMove(e);
      onMouseMove(e, index);
    },
    className: `Menu-Item ${className}`,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      if (onChange) onChange(value, index);
      if (onClick) onClick(e);
    },
    ...rest,
  });
}

export interface MenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size' | 'onChange'> {
  onChange?: (value: string | number, index: number) => void;
  children: React.ReactNode;
}

const defaultProps = {} as MenuProps;

const Menu = (props: MenuProps & typeof defaultProps) => {
  const { children, onKeyDown, onMouseMove, onChange, ...rest } = props;
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const [hoveringIndex, setHoveringIndex] = React.useState<number>(0);
  const lastCursorPosition = React.useRef({ x: 0, y: 0 });

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const childrenArray = React.Children.toArray(children).filter(child =>
        React.isValidElement(child)
      );
      if (onKeyDown) onKeyDown(e);
      switch (e.key) {
        case 'Enter':
          if (hoveringIndex !== -1) {
            e.preventDefault();
            if (onChange)
              onChange(
                (childrenArray[hoveringIndex] as React.ReactElement)?.props
                  .value,
                hoveringIndex
              );
          }
          break;
        case 'ArrowDown': {
          const isLastOption = hoveringIndex === childrenArray.length - 1;
          const newIndex = isLastOption ? 0 : hoveringIndex + 1;
          setHoveringIndex(newIndex);
          const nextElement: HTMLDivElement | undefined | null =
            popoverRef.current?.querySelector(
              `.Menu-Item:nth-of-type(${newIndex + 1})`
            );
          if (popoverRef.current && nextElement) {
            const scrollBottom =
              popoverRef.current.clientHeight + popoverRef.current.scrollTop;
            const elementBottom =
              nextElement.offsetTop + nextElement.offsetHeight;
            if (isLastOption)
              popoverRef.current.scrollTop = nextElement.offsetTop;
            else if (elementBottom > scrollBottom)
              popoverRef.current.scrollTop =
                elementBottom - popoverRef.current.clientHeight;
          }
          break;
        }
        case 'ArrowUp': {
          const isFirstOption = hoveringIndex === 0;
          const newIndex = isFirstOption
            ? childrenArray.length - 1
            : hoveringIndex - 1;
          setHoveringIndex(newIndex);
          const nextElement: HTMLDivElement | undefined | null =
            popoverRef.current?.querySelector(
              `.Menu-Item:nth-of-type(${newIndex + 1})`
            );
          if (popoverRef.current && nextElement) {
            if (isFirstOption)
              popoverRef.current.scrollTop =
                nextElement.offsetTop +
                nextElement.offsetHeight -
                popoverRef.current.clientHeight;
            else if (popoverRef.current.scrollTop > nextElement.offsetTop)
              popoverRef.current.scrollTop = nextElement.offsetTop;
          }
          break;
        }
        default:
      }
    },
    [children, hoveringIndex, onChange, onKeyDown]
  );

  const value = React.useMemo(
    () => ({
      onMouseMove: (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (
          lastCursorPosition.current.x !== e.screenX ||
          lastCursorPosition.current.y !== e.screenY
        )
          setHoveringIndex(index);
        lastCursorPosition.current = {
          x: e.screenX,
          y: e.screenY,
        };
      },
      onChange,
    }),
    [onChange]
  );

  return (
    <MenuContext.Provider value={value}>
      <Popover
        ref={popoverRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {React.Children.map(children, (child, index) => {
          return (
            React.isValidElement(child) &&
            React.cloneElement(child as React.ReactElement, {
              index,
              hovering: index === hoveringIndex,
            })
          );
        })}
      </Popover>
    </MenuContext.Provider>
  );
};
Menu.defaultProps = defaultProps;
Menu.Item = MenuItem;

export default Menu;

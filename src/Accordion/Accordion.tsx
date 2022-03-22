import React from 'react';
import clsx from 'clsx';

import { AsProps, PropsOf } from '../utils/types';
import useControlled from '../utils/useControlled';

const ExpandMoreRoundedIcon = (
  <svg d='M15.88 9.29L12 13.17 8.12 9.29a.9959.9959 0 00-1.41 0c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z' />
);

interface ContentType {
  expanded: boolean;
  handleClicked: (e: React.MouseEvent<HTMLElement>) => void;
}
const AccordionContext = React.createContext<ContentType>({
  expanded: false,
  handleClicked: () => {},
});

const DEFAULT_BASE = 'div';
interface AccordionOnlyProps<BaseElement> {
  expandedProps?: PropsOf<BaseElement>;
  expandedClassName?: string;
  defaultExpand?: boolean;
  expanded?: boolean;
}
export type AccordionProps<BaseElement> = AsProps<BaseElement> &
  PropsOf<BaseElement> &
  AccordionOnlyProps<BaseElement>;

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Toggle compound components cannot be rendered outside the Toggle component'
    );
  }
  return context;
}

const Accordion = <BaseElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: AccordionProps<BaseElement>
) => {
  const {
    className,
    as,
    expandedProps,
    defaultExpand,
    expanded: outerState,
    onClick,
    ...rest
  } = props;
  const [expanded, setExpanded] = useControlled<boolean>({
    state: outerState,
    default: Boolean(defaultExpand),
  });
  const handleClicked = React.useCallback(
    event => {
      event.stopPropagation();
      setExpanded(prev => !prev);
    },
    [setExpanded]
  );
  const value = React.useMemo(
    () => ({ expanded, handleClicked }),
    [expanded, handleClicked]
  );

  return (
    <AccordionContext.Provider value={value}>
      {React.createElement(as || 'div', {
        className: clsx(className, expanded && 'expanded'),
        ...rest,
        ...(expanded ? expandedProps : {}),
      })}
    </AccordionContext.Provider>
  );
};
Accordion.defaultProps = {
  expandedProps: {},
  expandedClassName: undefined,
  defaultExpand: false,
  expanded: undefined,
} as {
  expandedProps: object;
  expandedClassName: undefined;
  defaultExpand: false;
  expanded: undefined;
};

const Summary = <BasicElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: AccordionProps<BasicElement>
) => {
  const { as, className, expandedClassName, expandedProps, ...rest } = props;
  const { expanded } = useAccordionContext();
  return React.createElement(as || 'div', {
    className: clsx(
      'flex items-center',
      className,
      expanded && expandedClassName
    ),
    ...rest,
    ...(expanded ? expandedProps : {}),
  });
};
Summary.defaultProps = {
  expandedProps: {},
  expandedClassName: undefined,
  defaultExpand: false,
  expanded: undefined,
};

const Detail = <BasicElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: AccordionProps<BasicElement>
) => {
  const { as, className, expandedProps, ...rest } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const { expanded } = useAccordionContext();

  return React.createElement(as || 'div', {
    className: clsx(
      'transition-[max-height] overflow-hidden',
      expanded ? 'max-h-40' : 'max-h-0',
      className
    ),
    ref,
    ...rest,
    ...(expanded ? expandedProps : {}),
  });
};
Detail.defaultProps = {
  expandedProps: {},
  expandedClassName: undefined,
  defaultExpand: false,
  expanded: undefined,
};

const Toggle = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const { handleClicked } = useAccordionContext();
  if (React.Children.count(children) !== 1) {
    throw new Error('Toggle must contain exactly 1 children.');
  }
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onClick: handleClicked });
        }
        return child;
      })}
    </>
  );
};

const Button = <BasicElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: AccordionProps<BasicElement>
) => {
  const { onClick, children, expandedProps, expandedClassName } = props;
  const { expanded } = useAccordionContext();
  return (
    <div
      role='button'
      tabIndex={-1}
      className={clsx('m-2 w-6 h-6', expanded && expandedClassName)}
      onClick={onClick}
      onKeyPress={onClick}
      {...(expanded ? expandedProps : {})}
    >
      {children}
      <svg
        d='M15.88 9.29L12 13.17 8.12 9.29a.9959.9959 0 00-1.41 0c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z'
        className={clsx(expanded && 'rotate-180')}
      />
    </div>
  );
};
Button.defaultProps = {
  expandedProps: {},
  expandedClassName: undefined,
  defaultExpand: false,
  expanded: undefined,
};

Accordion.Summary = Summary;
Accordion.Detail = Detail;
Accordion.Toggle = Toggle;
Accordion.Button = Button;
export default Accordion;

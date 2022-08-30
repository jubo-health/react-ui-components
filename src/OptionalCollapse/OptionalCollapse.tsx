import React, { useEffect, useState } from 'react';

interface OptionalCollapseProps {
  in: boolean;
  children: React.ReactNode;
}
const OptionalCollapse = (props: OptionalCollapseProps) => {
  const { in: expanded, children } = props;
  const [transitionIn, setTransitionIn] = useState(expanded);

  useEffect(() => {
    if (expanded) setTransitionIn(true);
  }, [expanded]);

  return transitionIn || expanded ? (
    <div
      className='transition-[height]'
      // in={transitionIn && expanded}
      onTransitionEnd={() => {
        if (!expanded) setTransitionIn(false);
      }}
    >
      {children}
    </div>
  ) : null;
};

export default OptionalCollapse;

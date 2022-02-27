import React from 'react';
import { Story, Meta } from '@storybook/react';
import clsx from 'clsx';

import HideOnScroll, { HideOnScrollProps } from './HideOnScroll';

export default {
  title: 'HideOnScroll',
  component: HideOnScroll,
} as Meta;

export const PlayGround: Story<HideOnScrollProps> = (args) => {
  const lastY = React.useRef(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const anchor = React.useRef(0);

  return (
    <div
      className="h-80 relative overflow-auto"
      onScroll={(e: React.UIEvent<HTMLElement>) => {
        if (ref.current) {
          const hide = ref.current.style.animationDelay === '-1s';
          const dy = e.currentTarget.scrollTop - lastY.current;
          const dh = e.currentTarget.scrollTop - anchor.current;

          if ((!hide && dy > 0) || dh < ref.current.offsetHeight) {
            const moveOutPropotion = dh / ref.current.offsetHeight;
            if (moveOutPropotion < 1) {
              ref.current.style.animationDelay = `-${moveOutPropotion}s`;
            } else {
              ref.current.style.animationDelay = '-1s';
              anchor.current = 0;
            }
          }
          if (dy < 0) {
            const show = ref.current.style.animationDelay === '0s';
            if (show) {
              anchor.current = e.currentTarget.scrollTop;
            }
            if (dy < -80) {
              ref.current.style.animationDelay = '0s';
            }
          } else if (
            e.currentTarget.scrollTop + e.currentTarget.clientHeight ===
            e.currentTarget.scrollHeight
          ) {
            ref.current.style.animationDelay = '0s';
          }
          lastY.current = e.currentTarget.scrollTop;
        }
      }}
    >
      {/* <div className="sticky top-0 h-8 bg-white z-10">fixed</div> */}
      <HideOnScroll
        className={clsx('animate-zjit-hacked sticky top-0 animate-scroll-out')}
        ref={ref}
        {...args}
      >
        Hide
      </HideOnScroll>
      {Array(300)
        .fill('')
        .map((tmp, index) => (
          <div key={index}>{index}</div>
        ))}
    </div>
  );
};
PlayGround.args = {};

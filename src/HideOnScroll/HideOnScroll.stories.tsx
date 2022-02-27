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
  const [showAnimation, setShowAnimation] = React.useState(false);

  return (
    <div
      className="h-80 relative overflow-auto"
      onScroll={(e: React.UIEvent<HTMLElement>) => {
        if (ref.current) {
          const fullHide = ref.current.style.animationDelay === '0s';
          const fullShow = ref.current.style.animationDelay === '-1s';
          const dy = e.currentTarget.scrollTop - lastY.current;
          const dh = e.currentTarget.scrollTop - anchor.current;

          if ((!fullHide && dy > 0) || dh < ref.current.offsetHeight) {
            const moveOutPropotion = dh / ref.current.offsetHeight;
            if (moveOutPropotion < 1) {
              ref.current.style.animationDelay = `${
                moveOutPropotion <= 0 ? -1 : moveOutPropotion - 1
              }s`;
            } else {
              ref.current.style.animationDelay = '0s';
              anchor.current = 0;
            }
          }
          if (dy < 0) {
            if (fullShow) {
              anchor.current = e.currentTarget.scrollTop;
            } else if (fullHide && dy < -60) {
              setShowAnimation(true);
              ref.current.style.animationDelay = '0s';
            }
          } else if (
            fullHide &&
            e.currentTarget.scrollTop + e.currentTarget.clientHeight ===
              e.currentTarget.scrollHeight
          ) {
            setShowAnimation(true);
            ref.current.style.animationDelay = '0s';
          }
          lastY.current = e.currentTarget.scrollTop;
        }
      }}
    >
      {/* <div className="sticky top-0 h-8 bg-white z-10">fixed</div> */}
      <HideOnScroll
        className={clsx(
          'animate-scroll-out sticky top-0',
          showAnimation && 'animate-slide-in'
        )}
        onAnimationEnd={() => {
          if (showAnimation && ref.current) {
            ref.current.style.animationDelay = '-1s';
            ref.current.style.animation = 'none';
            ref.current.offsetHeight;
            ref.current.style.animation = '';
            setShowAnimation(false);
          }
        }}
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

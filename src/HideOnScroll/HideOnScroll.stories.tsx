import React from 'react';
import { Story, Meta } from '@storybook/react';

import { useStickyTransition, useStickyAnimation } from './hooks';

export default {
  title: 'HideOnScroll',
  // component: HideOnScroll,
} as Meta;

export const PlayGround: Story<any> = (args) => {
  const { onScroll, ref, onTransitionEnd } = useStickyTransition();
  return (
    <div
      className="h-80 relative overflow-auto"
      onScroll={onScroll}
    >
      <div className="sticky top-0 h-12 p-2 text-white bg-main z-10">fixed</div>
      <div className="bg-gray-300 p-2 sticky top-12" ref={ref} onTransitionEnd={onTransitionEnd}>
        Hide
      </div>
      {Array(300)
        .fill('')
        .map((tmp, index) => (
          <div key={index}>{index}</div>
        ))}
    </div>
  );
};
PlayGround.args = {};

export const Transition: Story<any> = (args) => {
  const { onScroll, ref, onTransitionEnd } = useStickyTransition();
  return (
    <div
      className="h-80 relative overflow-auto"
      onScroll={onScroll}
    >
      <div className="sticky top-0 h-8 bg-white z-10">fixed</div>
      <div className="bg-gray-200 p-2 sticky top-8" ref={ref} onTransitionEnd={onTransitionEnd}>
        Hide
      </div>
      {Array(300)
        .fill('')
        .map((tmp, index) => (
          <div key={index}>{index}</div>
        ))}
    </div>
  );
};

/**
 * WIP
 * @param args
 * @returns
 */
export const Animate: Story<any> = (args) => {
  const { onScroll, ref, onAnimationEnd } = useStickyAnimation();
  return (
    <div
      className="h-80 relative overflow-auto"
      onScroll={onScroll}
    >
      <div className="sticky top-0 h-8 bg-white z-10">fixed</div>
      <div
        className="bg-gray-200 p-2 sticky top-8 animate-[1s_linear_-1s_1_reverse_forwards_paused_scroll-out]"
        ref={ref}
        onAnimationEnd={onAnimationEnd}
      >
        Hide
      </div>
      {Array(300)
        .fill('')
        .map((tmp, index) => (
          <div key={index}>{index}</div>
        ))}
    </div>
  );
};

import React from 'react';
import { Story, Meta } from '@storybook/react';

import { useStickyTransition, useStickyAnimation } from './hooks';
import TransitionScroller, {
  TransitionScollerType,
} from './TransitionScroller';

export default {
  title: 'TransitionScroller',
  component: TransitionScroller,
} as Meta;

export const PlayGround: Story<TransitionScollerType> = args => {
  const { onScroll, ref, onTransitionEnd } = useStickyTransition();
  return (
    <div className='flex flex-col h-80'>
      <div>Header</div>
      <div>Subheader</div>
      <TransitionScroller className='flex-1'>
        <TransitionScroller.Transition>Scroll</TransitionScroller.Transition>
        {Array(300)
          .fill('')
          .map((tmp, index) => (
            <div key={index}>{index}</div>
          ))}
      </TransitionScroller>
    </div>
  );
};
PlayGround.args = {};

export const Transition: Story<any> = args => {
  const { onScroll, ref, onTransitionEnd } = useStickyTransition();
  return (
    <div className='h-80 relative overflow-auto' onScroll={onScroll}>
      <div
        className='bg-gray-200 p-2 sticky top-0'
        ref={ref}
        onTransitionEnd={onTransitionEnd}
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

/**
 * WIP
 * @param args
 * @returns
 */
export const Animate: Story<any> = args => {
  const { onScroll, ref, onAnimationEnd } = useStickyAnimation();
  return (
    <div className='h-80 relative overflow-auto' onScroll={onScroll}>
      <div
        className='bg-gray-200 p-2 sticky top-0 animate-[1s_linear_-1s_1_reverse_forwards_paused_scroll-out]'
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

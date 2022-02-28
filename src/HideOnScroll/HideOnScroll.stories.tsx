import React from 'react';
import { Story, Meta } from '@storybook/react';

import { HideOnScrollProps, useHideOnScroll } from './HideOnScroll';

export default {
  title: 'HideOnScroll',
  // component: HideOnScroll,
} as Meta;

export const PlayGround: Story<HideOnScrollProps> = (args) => {
  const { onScroll, HideOnScroll } = useHideOnScroll();
  return (
    <div
      className="h-80 relative overflow-auto"
      onScroll={onScroll}
    >
      {/* <div className="sticky top-0 h-8 bg-white z-10">fixed</div> */}
      <HideOnScroll className="bg-gray-200 p-2">
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

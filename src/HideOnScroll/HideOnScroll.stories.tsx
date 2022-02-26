import React from 'react';
import { Story, Meta } from '@storybook/react';
import clsx from 'clsx';

import HideOnScroll, { HideOnScrollProps } from './HideOnScroll';

export default {
  title: 'HideOnScroll',
  component: HideOnScroll,
} as Meta;

export const PlayGround: Story<HideOnScrollProps> = (args) => {
  const lastTime = React.useRef(+new Date());
  const lastY = React.useRef(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);
  return (
    <div
      className="h-80 relative overflow-auto"
      onScroll={(e: React.UIEvent<HTMLElement>) => {
        const speed =
          (e.currentTarget.scrollTop - lastY.current) /
          (e.timeStamp - lastTime.current);
        if (speed > 3 && show) setShow(false);
        else if (speed < -3) setShow(true);
        lastTime.current = e.timeStamp;
        lastY.current = e.currentTarget.scrollTop;
      }}
    >
      <div className="sticky top-0 h-8 bg-white z-10">fixed</div>
      <HideOnScroll
        className={clsx(
          'transition-top ease-linear duration-75 sticky top-0',
          show && 'top-8'
        )}
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

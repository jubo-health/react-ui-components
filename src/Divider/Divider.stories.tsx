import React from 'react';
import { Story, Meta } from '@storybook/react';

import Divider, { DividerProps } from './Divider';

const adornmentExamples = {
  none: null,
  text: 'text',
  element: <div>Button</div>,
};

export default {
  title: 'Divider',
  component: Divider,
  argTypes: {
    adornment: {
      options: Object.keys(adornmentExamples),
      mapping: adornmentExamples,
      control: {
        type: 'select',
        labels: {
          none: 'none',
          text: 'text',
          button: 'button',
        },
      },
    },
  },
} as Meta;

export const Basic: Story<DividerProps> = (args) => {
  return <Divider {...args} />;
};
Basic.args = {
  color: 'dark',
  size: 'l',
  children: '直接在 Children 放文字就可以了',
};

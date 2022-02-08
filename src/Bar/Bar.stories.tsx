import React from 'react';
import { Story, Meta } from '@storybook/react';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';

import Bar, { BarProps } from './Bar';

const adornmentExamples = {
  none: null,
  text: 'text',
  element: <div>Button</div>,
};

export default {
  title: 'Bar',
  component: Bar,
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

export const PlayGround: Story<BarProps> = (args) => {
  return <Bar {...args} />;
};
PlayGround.args = {
  color: 'dark',
  size: 'l',
  children: '直接在 Children 放文字就可以了',
};

export const Adornment: Story<BarProps> = () => {
  return (
    <>
      <Bar>
        <div>With Text Adornment</div>
        <div className="ml-auto">Adornment</div>
      </Bar>
      <Bar>
        <div>With Icon Adornment</div>
        <div className="ml-auto">
          <AccessibleForwardIcon />
        </div>
      </Bar>
    </>
  );
};

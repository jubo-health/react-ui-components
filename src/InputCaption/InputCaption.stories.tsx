import React from 'react';
import { Story, Meta } from '@storybook/react';

import InputCaption, { InputCaptionProps } from './InputCaption';

export default {
  title: 'InputCaption',
  component: InputCaption,
} as Meta;

export const PlayGround: Story<InputCaptionProps> = args => (
  <InputCaption {...args} />
);
PlayGround.args = {};

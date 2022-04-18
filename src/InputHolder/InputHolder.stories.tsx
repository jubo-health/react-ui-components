import React from 'react';
import { Story, Meta } from '@storybook/react';

import InputHolder, { InputHolderProps } from './index';

export default {
  title: 'InputHolder',
  component: InputHolder,
} as Meta;

export const PlayGround: Story<InputHolderProps> = args => (
  <InputHolder {...args} />
);
PlayGround.args = {};

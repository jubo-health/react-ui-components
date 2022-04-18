import React from 'react';
import { Story, Meta } from '@storybook/react';

import Input, { InputProps } from './Input';

export default {
  title: 'Input',
  component: Input,
} as Meta;

export const PlayGround: Story<InputProps> = args => <Input {...args} />;
PlayGround.args = {};

import React from 'react';
import { Story, Meta } from '@storybook/react';

import TextInput, { TextInputProps } from './TextInput';

export default {
  title: 'TextInput',
  component: TextInput,
} as Meta;

export const PlayGround: Story<TextInputProps> = (args) => (
  <TextInput {...args} />
);
PlayGround.args = {};

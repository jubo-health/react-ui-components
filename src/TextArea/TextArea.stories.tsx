import React from 'react';
import { Story, Meta } from '@storybook/react';

import TextArea, { TextareaProps } from './Textarea';
import TextInput from '../TextInput';

export default {
  title: 'TextArea',
  component: TextArea,
} as Meta;

export const PlayGround: Story<TextareaProps> = args => (
  <div>
    <TextArea {...args} />
    <TextInput />
  </div>
);
PlayGround.args = {};

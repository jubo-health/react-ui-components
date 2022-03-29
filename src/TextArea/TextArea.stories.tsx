import React from 'react';
import { Story, Meta } from '@storybook/react';

import TextArea, { TextAreaProps } from './TextArea';

export default {
  title: 'TextArea',
  component: TextArea,
} as Meta;

export const PlayGround: Story<TextAreaProps> = args => <TextArea {...args} />;
PlayGround.args = {};

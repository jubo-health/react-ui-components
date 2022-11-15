import React from 'react';
import { Story, Meta } from '@storybook/react';

import Label from './index';

export default {
  title: 'Label',
  component: Label,
} as Meta;

export const PlayGround: Story<React.ComponentProps<typeof Label>> = args => (
  <Label {...args} />
);
PlayGround.args = { children: 'label is always in capital', note: 'note' };

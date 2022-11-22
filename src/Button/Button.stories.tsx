import React from 'react';
import { Story, Meta } from '@storybook/react';

import Button from './index';

export default {
  title: 'Button',
  component: Button,
} as Meta;

export const PlayGround: Story<React.ComponentProps<typeof Button>> = args => (
  <Button {...args} />
);
PlayGround.args = {};

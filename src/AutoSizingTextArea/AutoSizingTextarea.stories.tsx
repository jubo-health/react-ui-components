import React from 'react';
import { Story, Meta } from '@storybook/react';

import AutoSizingTextarea, {
  AutoSizingTextareaProps,
} from './AutoSizingTextarea';

export default {
  title: 'AutoSizingTextarea',
  component: AutoSizingTextarea,
} as Meta;

export const PlayGround: Story<AutoSizingTextareaProps> = args => (
  <AutoSizingTextarea {...args} />
);
PlayGround.args = {};

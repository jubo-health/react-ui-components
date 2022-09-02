import React from 'react';
import { Story, Meta } from '@storybook/react';

import RadioGroup from './index';

export default {
  title: 'RadioGroup',
  component: RadioGroup,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof RadioGroup>
> = args => (
  <RadioGroup
    onChange={console.log}
    options={[
      { value: 'a', label: 'a' },
      { value: 'b', label: 'b' },
    ]}
  />
);
PlayGround.args = {};

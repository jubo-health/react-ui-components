import React from 'react';
import { Story, Meta } from '@storybook/react';

import NumberInput from './NumberInput';

export default {
  title: 'NumberInput',
  component: NumberInput,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof NumberInput>
> = args => <NumberInput {...args} />;

PlayGround.args = {
  placeholder: 'NumberInput placeholder',
};

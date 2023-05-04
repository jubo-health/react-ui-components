import React from 'react';
import { Story, Meta } from '@storybook/react';

import FormButton from './index';

export default {
  title: 'FormButton',
  component: FormButton,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof FormButton>
> = args => <FormButton {...args} />;
PlayGround.args = {
  children: 'Click Me',
  value: 'value',
  type: 'checkbox',
};

import React from 'react';
import { Story, Meta } from '@storybook/react';

import Textarea from '../Textarea';
import FormField, { FormFieldProps } from './index';

export default {
  title: 'FormField',
  component: FormField,
} as Meta;

export const PlayGround: Story<FormFieldProps> = args => (
  <FormField {...args} />
);
PlayGround.args = {
  label: 'label',
  sublabel: 'sublabel',
  caption: 'caption',
  children: <Textarea />,
};

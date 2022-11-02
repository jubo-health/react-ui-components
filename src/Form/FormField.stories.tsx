import React from 'react';
import { Story, Meta } from '@storybook/react';

import { useForm } from 'react-hook-form';
import Form from './index';

export default {
  title: 'Form.Field',
  component: Form.Field,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof Form.Field>
> = args => {
  const methods = useForm({ mode: 'onBlur' });
  return (
    <Form {...methods} onSubmit={() => {}}>
      <Form.Field {...args} />
    </Form>
  );
};
PlayGround.args = {
  name: 'name',
  required: true,
  label: 'label',
  note: '已帶入',
};
